const connect_to_db = require('./db');
const talk = require('./Talk_vote_idx');

module.exports.get_vote_by_idx = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('Received event:', JSON.stringify(event, null, 2));
  let body = {};
  if (event.body) {
    body = JSON.parse(event.body);
  }
  // set default
  /* parametri:
    - voto unico, id e numero stelle
    - media voti
  */
  if (!body.id) {
    callback(null, {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the talks. Identifier is null.'
    });
  }

  connect_to_db()
    .then(() => {
      console.log('=> get_all idx of next talks');
      if (!body.voto_limite) {
        talk.findOne({ _id: body.id }, 'title url main_speaker vote_user')
          .then(talks => {
            let bd = JSON.stringify(talks);
            let n = 0;
            let sum = 0;
            while (n < talks.vote_user.length) {
              sum += talks.vote_user[n].vote;
              n += 1;
            }
            const media = sum / n;
            bd = bd + JSON.stringify({ "media voti": media, "voti totali": n });

            if (body.voti_min && n < body.voti_min) {
              callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                  message: `Il talk ha meno di ${body.voti_min} voti totali.`,
                  talk: bd
                })
              });
            } else {
              callback(null, {
                statusCode: 200,
                body: bd
              });
            }
          })
          .catch(err => {
            callback(null, {
              statusCode: err.statusCode || 400,
              headers: { 'Content-Type': 'text/plain' },
              body: 'Could not fetch the talks.'
            });
          });
      } else {
        // Resto del codice per la selezione dei voti con voto_limite
      }
    })
    .catch(err => {
      callback(null, {
        statusCode: err.statusCode || 400,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Could not connect to the database.'
      });
    });
};
