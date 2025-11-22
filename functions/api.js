exports.handler = async function(event, context) {
    const API_KEY = process.env.RAPID_API_KEY;
    const HOST_DATA = "twitter241.p.rapidapi.com";
    const HOST_AVATAR = "twitter-avatar-api.p.rapidapi.com";

    const { endpoint, username, userId, url } = event.queryStringParameters;

    if (endpoint === "proxyImage") {
        if (!url) return { statusCode: 400, body: "URL yok" };
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Resim indirilemedi");
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
            const contentType = response.headers.get('content-type') || 'image/jpeg';
            return {
                statusCode: 200,
                body: JSON.stringify({ image: `data:${contentType};base64,${base64}` })
            };
        } catch (error) {
            return { statusCode: 200, body: JSON.stringify({ error: "Resim alınamadı" }) };
        }
    }

    if (!API_KEY) return { statusCode: 500, body: JSON.stringify({ error: "API Key eksik" }) };

    if (endpoint === "getAvatar") {
        try {
            const response = await fetch(`https://${HOST_AVATAR}/`, {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': HOST_AVATAR,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            if (!response.ok) throw new Error("Avatar servisi yanıt vermedi");

            const data = await response.json();
            const imageUrl = data.image_url;

            const imageFetch = await fetch(imageUrl);
            const buffer = Buffer.from(await imageFetch.arrayBuffer());
            const base64 = buffer.toString('base64');
            const contentType = imageFetch.headers.get('content-type') || 'image/png';

            return {
                statusCode: 200,
                body: JSON.stringify({ image: `data:${contentType};base64,${base64}` })
            };
        } catch (error) {
            return { statusCode: 200, body: JSON.stringify({ error: error.message }) };
        }
    }

    let targetUrl = "";
    if (endpoint === "getUser") {
        targetUrl = `https://${HOST_DATA}/user?username=${username}`;
    } else if (endpoint === "getTweets") {
        targetUrl = `https://${HOST_DATA}/user-tweets?user=${userId}&count=20`;
    } else {
        return { statusCode: 400, body: JSON.stringify({ error: "Geçersiz endpoint" }) };
    }

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': HOST_DATA }
        });

        if (!response.ok) return { statusCode: response.status, body: JSON.stringify({ error: "API Hatası" }) };

        const data = await response.json();
        return { statusCode: 200, body: JSON.stringify(data) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};