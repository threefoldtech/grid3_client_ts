import nslookup from "nslookup";

function nsLookup(domainName: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        nslookup(domainName).end((err, addr) => {
            if (err) reject(err);
            resolve(addr);
        });
    });
}

export { nsLookup };
