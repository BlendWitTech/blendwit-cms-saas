
async function main() {
    try {
        const res = await fetch('http://localhost:3001/projects');
        const data = await res.json();
        if (data.length > 0) {
            console.log('Project SEO Data:', JSON.stringify(data[0].seoMeta, null, 2));
        } else {
            console.log('No projects found');
        }
    } catch (e) {
        console.error(e);
    }
}
main();
