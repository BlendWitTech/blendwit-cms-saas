
async function main() {
    try {
        const res = await fetch('http://localhost:3001/blogs');
        const data = await res.json();
        if (data.length > 0) {
            console.log('SEO Data:', JSON.stringify(data[0].seo, null, 2));
        } else {
            console.log('No posts found');
        }
    } catch (e) {
        console.error(e);
    }
}
main();
