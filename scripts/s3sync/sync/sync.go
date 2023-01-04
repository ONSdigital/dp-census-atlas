package sync

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type Syncer struct {
	src    string
	bucket string
	prefix string

	sess	*session.Session
	s3	*s3.S3
}

func New(src, bucket, prefix string) (*Syncer, error) {
	return &Syncer{
		src:    src,
		bucket: bucket,
		prefix: prefix,
	}, nil
}

func (s *Syncer) Sync() error {
	if err := s.Login(); err != nil {
		return err
	}
	return s.List()
}

func (s *Syncer) Login() error {
	// completely depend on environment variables
	sess, err := session.NewSession()
	if err != nil {
		return err
	}
	s.sess = sess
	s.s3 = s3.New(sess)
	return nil
}

func (s *Syncer) List() error {
	in := &s3.ListBucketsInput{}

	out, err := s.s3.ListBuckets(in)
	if err != nil {
		return err
	}

	fmt.Println(out)
	return nil
/*
	in := &s3.ListObjectsV2Input{
		Bucket: &s.bucket,
	}

	pageNum := 0

	f := func(page *s3.ListObjectsV2Output, lastPage bool) bool {
		pageNum++
		fmt.Println(page)
		return pageNum <= 3
	}
	return s.s3.ListObjectsV2Pages(in, f)
*/
}
