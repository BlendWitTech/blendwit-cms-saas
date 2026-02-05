
async function main() {
    const id = 'e95430df-0f47-4de5-9d11-8e4740e03e5a'; // derived from log
    const body = {
        title: "Test Post",
        slug: "test-post",
        content: "Content",
        seo: {
            title: "Test SEO Title",
            description: "Test SEO Description"
        }
    };

    try {
        const res = await fetch(`http://localhost:3001/blogs/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log('Update Response:', JSON.stringify(data, null, 2));

        // Verify
        const res2 = await fetch(`http://localhost:3001/blogs/${id}`);
        const data2 = await res2.json();
        console.log('Verify Response:', JSON.stringify(data2, null, 2));
    } catch (e) { console.error(e); }
}
main();
