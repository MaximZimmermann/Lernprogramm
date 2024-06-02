const CACHE_NAME = 's85526-lernprogramm';

const CACHE_ASSETS = [
    'questions/Art.json',
    'questions/Computer Science.json',
    'questions/Geography.json',
    'questions/History.json',
    'questions/Literature.json',
    'questions/Math.json',
    'questions/Music.json',
    'questions/Science.json',
    'questions/Sports.json',
    'categories.json',
    'fonts/Inter-SemiBold.ttf',
    'fonts/Inter-VariableFont_slnt,wght.ttf',
    'mvc/app.html',
    'mvc/app.css',
    'mvc/app.js',
    'scripts/katex/katex-min.js',
    'scripts/katex/katex-min.css',
    'scripts/katex/contrib/auto-render.min.js',
    'images/logo.svg',
    'scripts/nav.js',
    'scripts/model.js',
    'scripts/quizEngine.js',
    'partials/category.html',
    'partials/quiz.html',
    'partials/categoryElement.html',
    'partials/filledCategory.html',
    'partials/edit.html',
    'partials/stats.html',
    'scripts/edit/MVC.js',
    'scripts/stats/MVC.js',
    'scripts/quiz/MVC.js',
    'scripts/quiz/view.js',
    'scripts/quiz/controller.js',
    'scripts/category/MVC.js',
    'scripts/category/view.js',
    'scripts/category/controller.js',
    'styles/quiz.css',
    'styles/category.css',
    'styles/edit.css',
    'styles/stats.css',
    'images/math.png',
    'images/history.png',
    'images/geography.png',
    'images/literature.png',
    'images/music.png',
    'images/science.png',
    'images/sports.png',
    'images/art.png',
    'images/computer_science.png',
    'images/quiz_server.jpeg',
];

self.addEventListener('install', event => event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_ASSETS))
));

self.addEventListener('fetch', event => { // Altered by ChatGPT so that live page is served unless offline
    event.respondWith(
        fetch(event.request).then(response => {
            // If the response is valid, clone it and store it in the cache.
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
            });
            return response;
        }).catch(() => {
            // If the network request fails, try to get the response from the cache.
            return caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            });
        })
    );
});