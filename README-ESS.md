# ESS Demo

This branch holds Viv's ESS demo work in progress.

## Viv's Demo

As it stands, the demo displays Viv's experimental data.

The content.json file is

	src/data/staticContentJsons/ess_content.json

And the data files live in

	https://ons-dp-sandbox-atlas-data.s3.eu-west.2.amazonaws.com/ESS

If you have node installed, you can see the demo:

	npm run dev

Then go to http://localhost:28100/

(If your dev server is not your workstation, run `npm run dev -- --host 0.0.0.0` and
go to `http://<your-dev-host>:28100`/)

## Demo with Sofia's spreadsheet

These are the steps to run the demo with data taken from Sofia's spreadsheet `machine_readable_updated_0303_3pm.xlsx`.

The `mkess` utility generates data tiles and break files from a CSV input file.

### Prerequisites

* The `xls2csv` Go program from the `dp-geodata-api` repo compiled and placed in your PATH. (This is optional if you want to just export the spreadsheet as a CSV.)

* The `mkess` Go program compiled and placed in your PATH. (This program is in the `main` branch of this repo.)

* The `breaks` Go program compiled and placed in your PATH. (This program is in the `main` branch of this repo.)

* The `s3sync` Go program compiled and placed in your PATH.

* The `aws-sso` Go program from `github.com/synfinatic/aws-sso-cli` compiled and placed in your PATH. See the "AWS SSO on ONS laptop" document in the Census Maps sharepoint.

* node installed

### Convert Spreadsheet to CSV

You can either export from your spreadsheet app, or use the `xls2csv` utility in the `dp-geodat-api` repo.

	xls2csv < machine_readable_updated_0303_3pm.xlsx | sed 1d > in.csv

(The sed command removes the first line of the spreadsheet, which is a note to people, and not data.)

### Decide S3 location for data files

Viv's data files live in `s3://ons-dp-sandbox-atlas-data/ESS`, which has the URL `https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/ESS`.

You can use any bucket you have access to and which is publically visible.

In this example, I am using the `ESS2` prefix in that same bucket.

### Generate data tiles from spreadsheet

`mkess` usage is like this:

	mkess -O <dir> -u <bucket-url> -t <taxonomy.json> < spreadsheet.csv

For example:

	mkess \
		-O ESS2 \
		-u https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/ESS2 \
		-t taxonomy.json \
		< in.csv

`mkess` creates the output files under the directory named in its `-O` argument.
The `-u` argument is needed because the bucket url is embedded in the resulting `ess_content.json` file.

### Generate new style breaksCkmeans files

`mkess` only generates data tiles.
We need `breaks` to generate the `breaksCkmeans` directory.

	breaks -I ESS2/tiles -O ESS2/breaksCkmeans

You'll see several messages about "not enough data", but these can be ignored.

### Upload data files to S3

	export AWS_REGION=eu-west-2

For a dry run:

	aws-sso exec \
		--account=<account> \
		--role=AdministratorAccess \
		-- \
		s3sync -n -D <dir> s3://<bucket>/<prefix>

For example, in sandbox:

	aws-sso exec \
		--account=337289154253 \
		--role=AdministratorAccess \
		-- \
		s3sync -n -D ESS2 s3://ons-dp-sandbox-atlas-data/ESS2

Leave off the `-n` to do it for reals.
The `-D` inhibits deletes on the remote end.
You can remove this if you are sure you are working with the right bucket and prefix.

### Install ess_content.json

Copy the generated `ess_content.json` to `src/data/staticContentJsons/ess_content.json`, overwriting the existing one.

### Start the app

In the root of the `dp-geodata-api` repo, run:

	npm run dev

or

	npm run dev -- --host 0.0.0.0

After a while you will see `ssr compile done`.
At this point you can go to `http://localhost:28100` or `http://<dev-host>:28100`.
