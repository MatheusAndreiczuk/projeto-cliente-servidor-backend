export default function logMiddleware(req, res, next) {
    try {
        const now = new Date().toISOString();
        const { method, originalUrl: url, headers, body } = req;

        const maskSensitive = (obj) => {
            if (obj == null) return obj;
            try {
                return JSON.parse(JSON.stringify(obj));
            } catch (e) {
                return obj;
            }
        };

        const allowedHeaders = ['authorization', 'content-type', 'accept', 'user-agent'];
        const safeHeaders = {};
        for (const k of Object.keys(headers || {})) {
            const kl = k.toLowerCase();
            if (allowedHeaders.includes(kl)) {
                let v = headers[k];
                if (kl === 'authorization' && typeof v === 'string') {
                    const parts = v.split(' ');
                    v = parts.length > 1 ? parts.slice(1).join(' ') : parts[0];
                }
                safeHeaders[kl] = v;
            }
        }

        const safeBody = maskSensitive(body);

    const sep = '-'.repeat(60);
    console.log(`\n${sep}`);
    console.log(`REQUEST  ${method} ${url}  @ ${now}`);
    console.log(sep);
    console.log('Headers:');
    try { console.log(JSON.stringify(safeHeaders, null, 2)); } catch { console.log(safeHeaders); }
    console.log('\nBody:');
    try { console.log(JSON.stringify(safeBody, null, 2)); } catch { console.log(safeBody); }

        const originalJson = res.json.bind(res);
        const originalSend = res.send.bind(res);

        const logResponse = (payload, statusCode) => {
            try {
                const outNow = new Date().toISOString();
                const sepOut = '-'.repeat(60);
                console.log('\n' + sepOut);
                console.log(`RESPONSE ${method} ${url} -> status ${statusCode || res.statusCode}  @ ${outNow}`);
                console.log(sepOut);
                try { console.log(JSON.stringify(payload, null, 2)); } catch { console.log(String(payload)); }
                console.log('\n'); 
            } catch (e) {
                console.log('Erro ao logar response:', e);
            }
        };

        res.json = (payload) => {
            const ret = originalJson(payload);
            logResponse(payload, res.statusCode);
            return ret;
        };

        res.send = (payload) => {
            const ret = originalSend(payload);
            logResponse(payload, res.statusCode);
            return ret;
        };

        next();
    } catch (e) {
        console.error('logMiddleware error:', e);
        next();
    }
}
