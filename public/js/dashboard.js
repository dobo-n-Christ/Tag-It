console.log('dashboard.js loaded');

const token = sessionStorage.getItem('authToken');
if (!token) {
    window.location.replace('login');
}

console.log('Identified token');

async function getUserContent() {
    try {
        const res = await fetch('/api/users', {headers: {'Authorization': `Bearer ${token}`}});
        const resJson = await res.json();
        const username = await resJson.username;
        console.log(username);
    }
    catch {
        window.location.replace('login');
    }
    //Show content for logged in user by calling apis to get the data needed

}

$(getUserContent);