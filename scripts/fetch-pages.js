
async function main() {
    try {
        const res = await fetch('http://localhost:3001/pages');
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
main();
