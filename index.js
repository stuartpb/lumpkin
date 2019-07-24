const csvParse = require('csv-parse');
const fs = require('fs');
const mergeOptions = require('merge-options');
const Bottleneck = require('bottleneck');

module.exports = function lumpkin(options) {
  if (options.user)
    options.smtp.auth.user = options.user;
  if (options.pass)
    options.smtp.auth.pass = options.pass;
  if (options.service)
    options.smtp.service = options.service;
  if (options.secure !== undefined)
    options.smtp.secure = !!options.secure;

  // we assume passthrough names if columns are specified as an array
  const columnNames = Array.isArray(options.columns)
    ? {name: 'name', email: 'email'}
    : options.columns || {};

  // TODO: get these defaults from somewhere else
  // TODO: try multiple column header names
  columnNames.name = columnNames.name || "Full Name";
  columnNames.email = columnNames.email || "Email";

  const transport = nodemailer.createTransport(options.smtp,
    mergeOptions(options.message, {
      from: options.from,
      subject: options.subject,
      html: options.html,
      text: options.text
    }));

  function sendMailForRow(row) {
    const name = row[columnNames.name];
    const address = row[columnNames.email];

    console.log(`Sending message to ${name} (${address})...`)
    return transporter.sendMail({to: {name, address}})
      // TODO: Handle possible partial rejections
      .then(info=>console.log(`Message delivered to ${address}`),
        err=>console.error(`Delivery failed to ${address}: ${err}`));
  }

  // note that bottleneck options take precedence over our short options here
  const limiter = new Bottleneck(mergeOptions({
    maxConcurrent: options.parallel || 1,
    minTime: options.pause
  }, options.bottleneck));

  const jobs = [];

  fs.createReadStream(options.recipients)
    .pipe(parse(mergeOptions(
      {columns: Array.isArray(options.columns) ? options.columns : true},
      // this allows options.csv.columns to list an array mapping,
      // and options.columns to list an object mapping
      options.csv)))
    .on('data', row => jobs.push(limiter.schedule(sendMailForRow, row)))
    .on('end', () => Promise.all(jobs).then(
      () => console.log('All messages sent')));
}
