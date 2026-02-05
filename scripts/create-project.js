
async function main() {
    const body = {
        title: "Test Project",
        slug: "test-project-" + Date.now(),
        description: "A test project",
        status: "COMPLETED",
        seoMeta: {
            title: "Project SEO Title",
            description: "Project SEO Description",
            keywords: "test, project"
        }
    };

    try {
        const res = await fetch('http://localhost:3001/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log('Created Project:', JSON.stringify(data.seoMeta, null, 2));
    } catch (e) {
        console.error(e);
    }
}
main();
