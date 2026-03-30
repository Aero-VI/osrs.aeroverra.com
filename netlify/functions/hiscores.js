// Netlify Function for OSRS Hiscores API Proxy
// Auto-deploys with the site on Netlify

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const player = event.queryStringParameters?.player;

  if (!player) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing player parameter' }),
    };
  }

  try {
    const osrsUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(player)}`;
    const response = await fetch(osrsUrl);

    if (!response.ok) {
      throw new Error('Player not found');
    }

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=300',
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
