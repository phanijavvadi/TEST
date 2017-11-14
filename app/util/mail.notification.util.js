import * as config from '../../config/config';
import _ from "lodash";

const sg = require('sendgrid')(config.SENDGRID_API_KEY);
export function sendMail(obj = {}) {

  if (!obj.to || obj.to.length === 0) {
    return;
  }
  let to = _.map(obj.to, (a) => {
    return {
      email: a.email,
      name: a.name || ''
    }
  });
  let from = {
    email: obj.from && obj.from.email || config.mailNotifications.admin.from,
    name: obj.from && obj.from.name || config.mailNotifications.admin.name,
  }

  let request=sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: to,
          subject: obj.subject
        }
      ],
      from: from,
      content: [
        {
          type: 'text/html',
          value: obj.body
        }
      ]
    }
  });
  sg.API(request, function(error, response) {});
}
