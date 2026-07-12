const randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

document.getElementById('submit').addEventListener('click', function () {
    const selected = Number(document.getElementById('field').value)
    attempts++;
    if (selected === randomNumber) {
        document.getElementById('demo').innerText = `!.تبریک، تبریک به تو، تبریک به خودم، تبریک به همه`;
    } else if (selected > randomNumber) {
        document.getElementById('demo').innerText = `.خخخ☺ اشتباه زدی، بزرگتره`;
    } else if (selected < randomNumber) {
        document.getElementById('demo').innerText = `.خخخ☺ اشتباه زدی، کوچیکتره`;
    }
});