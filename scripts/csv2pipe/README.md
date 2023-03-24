# csv2pipe

`csv2pipe` converts a comma-delimited CSV to a pipe-delimited version suitable for use with awk.

Newlines and carriage returns within field values are converted to the literal strings `\r` and `\n`, and pipes within field values are changed to `\,`.

Backslashes are changed to `\\`.

For example, if a row in the CSV looks like this:

	col1,"embedded
        newline",field with | character

the result will be

	col1|embedded\nnewline|field with \, character

`csv2pipe` reads and writes on stdin and stdout only.

Once a file has been converted, awk can be invoked with `-F'|'`.

Example:

	csv2pipe < source.csv | awk -F '{print $3}' | sort | uniq
