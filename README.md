# lumpkin

A command-line bulk mailer.

## Base options

Every base option to Lumpkin can be defined as either a command-line argument or an environment variable.

Most of these short options are aliases/overrides for deeper options:

- user: base for `smtp.auth.user`
- pass: base for `smtp.auth.pass`
- secure: base for `smtp.secure`
- from: base for `message.from`
- subject: base for `message.subject`
- parallel: How many mails to try sending at once (1, by default).
- pause: How long to wait before sending another mail, in milliseconds (0 by default).

The `--html` and `--text` options, at the command line, specify a *filename* for the content to be used for `message.html` and `message.text`, respectively.

The `--use` option specifies the filename of a YAML (or JSON) profile to read and overwrite any prior defined options.

The `--yaml` (or `--json`) options specify a YAML *string* to define options, in the same fashion.

The `--body` option defines a string to use as `message.text`.

The base `columns` value can take either an array (containing `'name'` and `'email'` column positions) or an object (with the column headers used to define `name` and `email`). It's not great, and currently being rearchitected (though the rearchitected form will likely be compatible with this format).

## csv

[Options to `csv-parse`.](https://csv.js.org/parse/options/)

Note that the base `columns` option currently *overlaps* the `csv.columns` option when `columns` is an object and `csv.columns` is an array. This is a weird quirk of the current hacky design: once the base `columns` option spec is overhauled, the `csv.columns` option will always be ignored.

## bottleneck

[Options to `Bottleneck` constructor](https://github.com/SGrondin/bottleneck#constructor), for rate-limiting.

Note that the `parallel` and `pause` options are overridden by this.

## smtp

[Options to the Nodemailer SMTP transport constructor.](https://nodemailer.com/smtp/)

Lumpkin is also compatible with all the mail-configuring environment variables from [Envigor](https://github.com/stuartpb/envigor).

Note that the base `user`, `pass`, `service` and `secure` options override any deeper options here.

## message

[Defaults for Nodemailer message options.](https://nodemailer.com/message/)

Note that the base `from`, `subject`, `html` and `text` options will override any options set here.

## Name

Lumpkin is named after [Willie Lumpkin](https://en.wikipedia.org/wiki/Willie_Lumpkin), the Fantastic Four's mailman.
