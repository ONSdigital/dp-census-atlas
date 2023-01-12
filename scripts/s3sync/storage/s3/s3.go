package s3

import (
	"context"
	"fmt"
	"io"
	"path"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	awss3 "github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"

	"github.com/ONSdigital/dp-census-atlas/scripts/s3sync/storage"
)

// S3 implements storage.Filer
type S3 struct {
	s3       *awss3.S3
	uploader *s3manager.Uploader
	bucket   string
	prefix   string
}

// New creates a new S3 Filer based at bucket:prefix.
func New(bucket, prefix string) (*S3, error) {
	sess, err := session.NewSession()
	if err != nil {
		return nil, err
	}

	// ensure prefix is in a state where it can be path-joined to names
	// to form object keys
	prefix = path.Clean(prefix)
	prefix = strings.TrimPrefix(prefix, "/")
	if prefix == "." {
		prefix = ""
	}
	prefix = storage.Normalise(prefix)

	return &S3{
		s3:       awss3.New(sess),
		uploader: s3manager.NewUploader(sess),
		bucket:   bucket,
		prefix:   prefix,
	}, nil
}

// Scan is an S3 equivalent of os.ReadDir; it reads filenames from a bucket and prefix.
func (s *S3) Scan(ctx context.Context) (map[string]*storage.FileInfo, error) {
	infos := make(map[string]*storage.FileInfo)

	// When a prefix is included in an S3 list objects request, objects which do
	// not have that prefix are not returned.
	// But the object keys that _are_ returned include the prefix.
	// So we need to strip the prefix when we are generating our list of objects.
	// The prefix will be restored in any S3 API calls.
	prefix := s.prefix
	if prefix != "" {
		prefix += "/"
	}

	in := &awss3.ListObjectsV2Input{
		Bucket: &s.bucket,
		Prefix: &prefix,
	}

	fcn := func(page *awss3.ListObjectsV2Output, lastPage bool) bool {
		for _, obj := range page.Contents {
			path := storage.Normalise(*obj.Key)
			path = strings.TrimPrefix(path, prefix)
			infos[storage.PathToKey(path)] = &storage.FileInfo{
				Name: path,
			}
		}
		return true
	}
	if err := s.s3.ListObjectsV2PagesWithContext(ctx, in, fcn); err != nil {
		return nil, err
	}
	return infos, nil
}

// Checksum calls S3 to get the CRC32 checksum of the object named bucket:prefix+name.
func (s *S3) Checksum(ctx context.Context, name string) (string, error) {
	key := s.fullpath(name)
	in := &awss3.GetObjectAttributesInput{
		Bucket: &s.bucket,
		Key:    &key,
		ObjectAttributes: []*string{
			aws.String("Checksum"),
		},
	}
	out, err := s.s3.GetObjectAttributesWithContext(ctx, in)
	if err != nil {
		return "", err
	}

	checksum := out.Checksum
	if checksum == nil {
		return "", fmt.Errorf("%s:%s: %w", s.bucket, key, storage.ErrMissingChecksum)
	}
	crc32 := checksum.ChecksumCRC32
	if crc32 == nil {
		return "", fmt.Errorf("%s:%s: %w", s.bucket, key, storage.ErrMissingChecksum)
	}
	return *crc32, nil
}

// Remove removes the S3 object bucket:prefix+name.
func (s *S3) Remove(ctx context.Context, name string) error {
	key := s.fullpath(name)
	in := &awss3.DeleteObjectInput{
		Bucket: &s.bucket,
		Key:    &key,
	}
	_, err := s.s3.DeleteObjectWithContext(ctx, in)
	return err
}

// Create creates an S3 object named bucket:prefix+name.
// The contents of the object come from r, and the CRC32 checksum is expected to
// match checksum.
func (s *S3) Create(ctx context.Context, name string, r io.Reader, checksum string) error {
	key := s.fullpath(name)

	// would use PutObject, but it wants a ReadSeeker, which GetObject
	// doesn't provide!
	in := &s3manager.UploadInput{
		Body:              r,
		Bucket:            &s.bucket,
		Key:               &key,
		ChecksumAlgorithm: aws.String(awss3.ChecksumAlgorithmCrc32),
		ChecksumCRC32:     &checksum,
		// ACL: aws.String(s3.BucketCannedACLPublicRead),
	}
	_, err := s.uploader.UploadWithContext(ctx, in)
	return err
}

// Open returns a ReadCloser which can be used to read an object's contents.
// The object is named bucket:prefix+name.
// Caller is responsible for closing the returned ReadCloser.
func (s *S3) Open(ctx context.Context, name string) (io.ReadCloser, error) {
	key := s.fullpath(name)
	in := &awss3.GetObjectInput{
		Bucket: &s.bucket,
		Key:    &key,
	}
	out, err := s.s3.GetObjectWithContext(ctx, in)
	if err != nil {
		return nil, err
	}
	return out.Body, nil
}

// fullpath returns name's full object path within the bucket.
func (s *S3) fullpath(name string) string {
	return path.Clean(path.Join(s.prefix, name))
}
