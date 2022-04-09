const healthSimpleTemplate = (status) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Status</title>
      </head>
      <body>
        <div style="margin-bottom: 10px;">Uptime: ${status.uptime}</div>
        <div style="margin-bottom: 10px;">Date: ${status.date}</div>
        <div>Status: ${status.status}</div>
      </body>
    </html>
  `;
};

module.exports = healthSimpleTemplate;
