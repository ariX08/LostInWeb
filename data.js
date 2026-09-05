/* LostInWeb — Curated interesting websites (2025–2026 alive)
   Categories: tools, games, articles, weird, interactive, creative, science, art
*/
const SITES = [
  // Neal.fun & major interactive
  { url: "https://neal.fun/", title: "Neal.fun", desc: "Hub of polished browser experiments and interactive toys", cat: "interactive" },
  { url: "https://neal.fun/infinite-craft/", title: "Infinite Craft", desc: "Combine elements with AI to invent anything", cat: "games" },
  { url: "https://neal.fun/password-game/", title: "The Password Game", desc: "Create a password that meets absurd escalating rules", cat: "games" },
  { url: "https://neal.fun/deep-sea/", title: "The Deep Sea", desc: "Scroll into the ocean depths and meet its creatures", cat: "science" },
  { url: "https://neal.fun/spend/", title: "Spend Bill Gates' Money", desc: "Try to burn through a billion dollars on real products", cat: "games" },
  { url: "https://neal.fun/asteroid-launcher/", title: "Asteroid Launcher", desc: "Simulate asteroid impacts on real locations", cat: "science" },
  { url: "https://neal.fun/absurd-trolley-problems/", title: "Absurd Trolley Problems", desc: "Ethical dilemmas with increasingly ridiculous twists", cat: "interactive" },
  { url: "https://neal.fun/size-of-space/", title: "The Size of Space", desc: "Visualize the staggering scale of the universe", cat: "science" },
  { url: "https://neal.fun/internet-artifacts/", title: "Internet Artifacts", desc: "A museum of early web culture and forgotten interfaces", cat: "art" },
  { url: "https://neal.fun/stimulation-clicker/", title: "Stimulation Clicker", desc: "A clicker that parodies modern internet overload", cat: "games" },
  { url: "https://neal.fun/draw-a-perfect-circle/", title: "Draw a Perfect Circle", desc: "Test how steady your hand really is", cat: "games" },
  { url: "https://neal.fun/wonders-of-street-view/", title: "Wonders of Street View", desc: "Beautiful and strange places captured by Google", cat: "interactive" },
  { url: "https://neal.fun/space-elevator/", title: "Space Elevator", desc: "Ride an elevator from Earth into orbit", cat: "science" },
  { url: "https://neal.fun/life-stats/", title: "Life Stats", desc: "Real-time stats about your life so far", cat: "interactive" },
  { url: "https://neal.fun/progress/", title: "Progress", desc: "Visual progress bars for human civilization milestones", cat: "science" },

  // Classic weird / one-joke
  { url: "https://theuselessweb.com/", title: "The Useless Web", desc: "One button sends you to a random pointless website", cat: "weird" },
  { url: "https://pointerpointer.com/", title: "Pointer Pointer", desc: "Photos of hands that always point at your cursor", cat: "weird" },
  { url: "https://cat-bounce.com/", title: "Cat Bounce", desc: "Bouncing cartoon cats. That’s the whole site", cat: "weird" },
  { url: "https://findtheinvisiblecow.com/", title: "Find the Invisible Cow", desc: "Hunt an invisible cow by sound alone", cat: "games" },
  { url: "https://hackertyper.com/", title: "Hacker Typer", desc: "Type anything and look like a movie hacker", cat: "weird" },
  { url: "https://zombo.com/", title: "Zombo.com", desc: "The classic 1999 infinite possibility loop", cat: "weird" },
  { url: "https://koalastothemax.com/", title: "Koalas to the Max", desc: "Reveal a hidden koala by hovering over circles", cat: "art" },
  { url: "https://zoomquilt.org/", title: "Zoomquilt", desc: "Infinitely zooming collaborative surreal painting", cat: "art" },
  { url: "https://thisissand.com/", title: "This Is Sand", desc: "Pour colorful digital sand into layered art", cat: "creative" },
  { url: "https://patatap.com/", title: "Patatap", desc: "Keyboard keys trigger unique animations and sounds", cat: "creative" },
  { url: "https://staggeringbeauty.com/", title: "Staggering Beauty", desc: "Wiggle your mouse and watch the worm dance", cat: "weird" },
  { url: "https://heeeeeeeey.com/", title: "Heeeeeeeey", desc: "Just an endless greeting", cat: "weird" },
  { url: "https://fallingfalling.com/", title: "Falling Falling", desc: "Colored bands fall forever", cat: "weird" },
  { url: "https://isitchristmas.com/", title: "Is It Christmas?", desc: "A definitive yes or no answer", cat: "weird" },
  { url: "https://eelslap.com/", title: "Eel Slap", desc: "Slap someone with an eel", cat: "weird" },

  // Ambient / calm
  { url: "https://radio.garden/", title: "Radio Garden", desc: "Spin a globe and listen to live radio anywhere", cat: "creative" },
  { url: "https://window-swap.com/", title: "WindowSwap", desc: "Look out of strangers’ windows around the world", cat: "interactive" },
  { url: "https://asoftmurmur.com/", title: "A Soft Murmur", desc: "Mix ambient sounds — rain, thunder, café noise", cat: "tools" },
  { url: "https://mynoise.net/", title: "myNoise", desc: "Highly customizable ambient soundscapes", cat: "tools" },
  { url: "https://rainymood.com/", title: "Rainy Mood", desc: "Endless rain sounds for focus or sleep", cat: "tools" },
  { url: "https://imissmycafe.com/", title: "I Miss My Café", desc: "Café ambience when you can’t go out", cat: "tools" },

  // Maps & exploration
  { url: "https://www.mapcrunch.com/", title: "MapCrunch", desc: "Random Google Street View location on Earth", cat: "interactive" },
  { url: "https://www.atlasobscura.com/", title: "Atlas Obscura", desc: "Curious and wondrous places around the world", cat: "articles" },
  { url: "https://earth.google.com/web/", title: "Google Earth", desc: "Explore the planet in 3D", cat: "science" },
  { url: "https://www.thetruesize.com/", title: "The True Size Of", desc: "Compare the real sizes of countries on a map", cat: "tools" },
  { url: "https://random.earth/", title: "Random Earth", desc: "Random spots as if viewed from the ISS", cat: "interactive" },
  { url: "https://orbis.stanford.edu/", title: "ORBIS", desc: "Travel routes and costs in the Roman world", cat: "science" },

  // Music & sound
  { url: "https://everynoise.com/", title: "Every Noise at Once", desc: "Vast map of music genres you can click and hear", cat: "creative" },
  { url: "https://radiooooo.com/", title: "Radiooooo", desc: "Pick a country and decade, then press play", cat: "creative" },
  { url: "https://incredibox.com/", title: "Incredibox", desc: "Create beatbox music by dragging sounds onto characters", cat: "creative" },
  { url: "https://musiclab.chromeexperiments.com/Song-Maker/", title: "Chrome Music Lab: Song Maker", desc: "Compose music by clicking a grid", cat: "creative" },
  { url: "https://blobopera.app/", title: "Blob Opera", desc: "Compose opera by moving cute animated blobs", cat: "creative" },

  // Games & time sinks
  { url: "https://www.geoguessr.com/", title: "GeoGuessr", desc: "Guess your location from Street View", cat: "games" },
  { url: "https://littlealchemy2.com/", title: "Little Alchemy 2", desc: "Combine elements to discover hundreds of items", cat: "games" },
  { url: "https://www.decisionproblem.com/paperclips/", title: "Universal Paperclips", desc: "Make paperclips… then question existence", cat: "games" },
  { url: "https://orteil.dashnet.org/cookieclicker/", title: "Cookie Clicker", desc: "The original idle cookie empire", cat: "games" },
  { url: "https://adarkroom.florianhimsl.com/", title: "A Dark Room", desc: "Minimal text adventure that expands into a world", cat: "games" },
  { url: "https://quickdraw.withgoogle.com/", title: "Quick, Draw!", desc: "Draw and let AI guess what it is", cat: "games" },
  { url: "https://www.thewikigame.com/", title: "The Wiki Game", desc: "Race between Wikipedia pages using only links", cat: "games" },
  { url: "https://onesquareminesweeper.com/", title: "One Square Minesweeper", desc: "Minesweeper with one square. 50/50 odds", cat: "games" },
  { url: "https://reallybadchess.com/", title: "Really Bad Chess", desc: "Chess with randomized, terrible piece setups", cat: "games" },
  { url: "https://sandspiel.club/", title: "Sandspiel", desc: "Falling-sand physics sandbox you can play in", cat: "games" },

  // Art & creative coding
  { url: "https://silk.genso.me/", title: "Silk", desc: "Create flowing generative art with your mouse", cat: "art" },
  { url: "https://www.jacksonpollock.org/", title: "Jackson Pollock", desc: "Drip paint like the abstract expressionist", cat: "art" },
  { url: "https://weavesilk.com/", title: "WeaveSilk", desc: "Symmetrical generative silk drawings", cat: "art" },
  { url: "https://www.chrometosphere.com/", title: "Chrometosphere", desc: "Interactive metallic particle playground", cat: "art" },
  { url: "https://ncase.me/", title: "Nicky Case", desc: "Explorable explanations and interactive essays", cat: "interactive" },
  { url: "https://ncase.me/trust/", title: "The Evolution of Trust", desc: "Interactive game theory about cooperation", cat: "interactive" },
  { url: "https://ncase.me/polygons/", title: "Parable of the Polygons", desc: "A playable story about bias and segregation", cat: "interactive" },

  // Science & knowledge
  { url: "https://htwins.net/scale2/", title: "Scale of the Universe 2", desc: "Zoom from quarks to galaxy clusters", cat: "science" },
  { url: "https://www.solarviews.com/eng/earth.htm", title: "Views of the Solar System", desc: "Classic planetary exploration resource", cat: "science" },
  { url: "https://eyes.nasa.gov/", title: "NASA Eyes", desc: "Real-time 3D views of spacecraft and planets", cat: "science" },
  { url: "https://stellarium-web.org/", title: "Stellarium Web", desc: "Interactive planetarium in your browser", cat: "science" },
  { url: "https://www.etymonline.com/", title: "Online Etymology Dictionary", desc: "Where words actually come from", cat: "tools" },
  { url: "https://www.gutenberg.org/", title: "Project Gutenberg", desc: "Tens of thousands of free classic books", cat: "articles" },
  { url: "https://archive.org/", title: "Internet Archive", desc: "The Wayback Machine and a library of everything", cat: "tools" },
  { url: "https://scholar.google.com/", title: "Google Scholar", desc: "Search academic papers and citations", cat: "tools" },
  { url: "https://www.wolframalpha.com/", title: "WolframAlpha", desc: "Computational knowledge engine", cat: "tools" },

  // Tools & utilities
  { url: "https://www.remove.bg/", title: "Remove.bg", desc: "Instantly remove image backgrounds with AI", cat: "tools" },
  { url: "https://photopea.com/", title: "Photopea", desc: "Full-featured image editor that runs in the browser", cat: "tools" },
  { url: "https://www.desmos.com/calculator", title: "Desmos", desc: "Beautiful free graphing calculator", cat: "tools" },
  { url: "https://excalidraw.com/", title: "Excalidraw", desc: "Virtual whiteboard for sketching diagrams", cat: "tools" },
  { url: "https://carbon.now.sh/", title: "Carbon", desc: "Create beautiful images of your source code", cat: "tools" },
  { url: "https://typelit.io/", title: "Typelit", desc: "Practice typing by retyping classic novels", cat: "tools" },
  { url: "https://www.omnieye.com/", title: "OmniEye", desc: "Live webcam feeds from around the world", cat: "interactive" },

  // More weird & obscure gems
  { url: "https://www.boredbutton.com/", title: "Bored Button", desc: "One click to a random activity or site", cat: "weird" },
  { url: "https://www.pointlesssites.com/", title: "Pointless Sites", desc: "Directory of wonderfully useless websites", cat: "weird" },
  { url: "https://noclip.website/", title: "Noclip", desc: "Fly through abandoned levels of old video games", cat: "interactive" },
  { url: "https://www.windows93.net/", title: "Windows 93", desc: "A surreal parody operating system in the browser", cat: "weird" },
  { url: "https://www.thequietplaceproject.com/thequietplace", title: "The Quiet Place", desc: "A space to write something and leave it behind", cat: "interactive" },
  { url: "https://www.drawastickman.com/", title: "Draw a Stickman", desc: "Interactive stickman adventure you draw yourself", cat: "games" },
  { url: "https://www.notpron.com/", title: "Notpron", desc: "One of the hardest online riddle games ever", cat: "games" },
  { url: "https://www.linusakesson.net/scene/longcat/", title: "Longcat", desc: "How long can a cat be?", cat: "weird" },
  { url: "https://www.rrrrrrrrr.com/", title: "Rrrrrrrrr", desc: "Just the letter R. Lots of it", cat: "weird" },
  { url: "https://www.omfgdogs.com/", title: "OMFG Dogs", desc: "Dogs spinning to a catchy tune", cat: "weird" },

  // Creative coding & demos
  { url: "https://experiments.withgoogle.com/", title: "Google Experiments", desc: "Collection of creative coding experiments", cat: "creative" },
  { url: "https://chrome.google.com/webstore/category/collection/web_experiments", title: "Chrome Experiments", desc: "Pushing the limits of the browser", cat: "creative" },
  { url: "https://threejs.org/examples/", title: "Three.js Examples", desc: "Stunning 3D demos built with WebGL", cat: "creative" },
  { url: "https://www.shadertoy.com/", title: "Shadertoy", desc: "Live-coding community for GPU shaders", cat: "creative" },
  { url: "https://codepen.io/trending", title: "CodePen Trending", desc: "Front-end experiments from the community", cat: "creative" },

  // History & culture
  { url: "https://www.oldweb.today/", title: "Oldweb.today", desc: "Browse the web as it looked in different eras", cat: "interactive" },
  { url: "https://web.archive.org/", title: "Wayback Machine", desc: "Travel back in time through archived pages", cat: "tools" },
  { url: "https://www.homestarrunner.com/", title: "Homestar Runner", desc: "Classic flash-era cartoons that still delight", cat: "art" },
  { url: "https://www.geocities.ws/", title: "GeoCities Archive", desc: "Remnants of the personal homepage era", cat: "weird" },

  // More interactive experiences
  { url: "https://www.cityguesser.com/", title: "City Guesser", desc: "Identify cities from random video clips", cat: "games" },
  { url: "https://www.whatbeatsrock.com/", title: "What Beats Rock", desc: "A simple game of logic and creativity", cat: "games" },
  { url: "https://onemillioncheckboxes.com/", title: "One Million Checkboxes", desc: "A shared grid of a million checkboxes", cat: "interactive" },
  { url: "https://www.annasgarden.vercel.app/", title: "Anna’s Garden", desc: "Draw a flower and plant it in a shared garden", cat: "creative" },
  { url: "https://gradient.horse/", title: "Gradient Horse", desc: "Sketch a horse that joins a herd of others", cat: "creative" },
  { url: "https://www.pointercrate.com/", title: "Pointercrate", desc: "Geometry Dash extreme demon list (if you dare)", cat: "games" },

  // Science visualizations
  { url: "https://www.blitzortung.org/", title: "Blitzortung", desc: "Real-time global lightning strike map", cat: "science" },
  { url: "https://www.windy.com/", title: "Windy", desc: "Beautiful interactive weather & wind maps", cat: "science" },
  { url: "https://earth.nullschool.net/", title: "Earth Nullschool", desc: "Global weather visualized as flowing particles", cat: "science" },
  { url: "https://www.flightradar24.com/", title: "Flightradar24", desc: "Live air traffic around the planet", cat: "science" },
  { url: "https://www.marinetraffic.com/", title: "MarineTraffic", desc: "Track ships in real time", cat: "science" },
  { url: "https://www.satellite-map.space/", title: "Satellite Map", desc: "Track live satellite positions and orbits", cat: "science" },

  // AI toys & modern
  { url: "https://teachablemachine.withgoogle.com/", title: "Teachable Machine", desc: "Train a simple ML model with your webcam", cat: "tools" },
  { url: "https://experiments.withgoogle.com/collection/ai", title: "Google AI Experiments", desc: "Playful experiments with machine learning", cat: "interactive" },
  { url: "https://www.thispersondoesnotexist.com/", title: "This Person Does Not Exist", desc: "AI-generated faces of people who never lived", cat: "weird" },
  { url: "https://www.thiswaifudoesnotexist.net/", title: "This Waifu Does Not Exist", desc: "AI-generated anime characters", cat: "weird" },
  { url: "https://artbreeder.com/", title: "Artbreeder", desc: "Evolve images by mixing genetic-style traits", cat: "creative" },

  // Extra gems
  { url: "https://www.samsy.ninja/", title: "Samsy Portfolio", desc: "Immersive WebGL portfolio experience", cat: "art" },
  { url: "https://www.awwwards.com/websites/", title: "Awwwards", desc: "Award-winning web design inspiration", cat: "art" },
  { url: "https://www.hoverstat.es/", title: "Hover States", desc: "Curated collection of interactive web experiences", cat: "art" },
  { url: "https://www.brutalistwebsites.com/", title: "Brutalist Websites", desc: "Raw, anti-design web aesthetics", cat: "art" },
  { url: "https://www.cssdesignawards.com/", title: "CSS Design Awards", desc: "Outstanding CSS and web design work", cat: "art" },

  // More games & interactives
  { url: "https://www.linustechtips.com/", title: "Linus Tech Tips Forum", desc: "Deep rabbit hole of tech discussion (use carefully)", cat: "articles" },
  { url: "https://www.reddit.com/r/InternetIsBeautiful/", title: "r/InternetIsBeautiful", desc: "Daily curated interesting websites from the community", cat: "articles" },
  { url: "https://www.reddit.com/r/ObscureMedia/", title: "r/ObscureMedia", desc: "Forgotten media and lost corners of culture", cat: "articles" },
  { url: "https://kottke.org/", title: "Kottke.org", desc: "Long-running blog of interesting links and ideas", cat: "articles" },
  { url: "https://www.themarginalian.org/", title: "The Marginalian", desc: "Brain-pickings of art, science, and meaning", cat: "articles" },
  { url: "https://www.brainpickings.org/", title: "Brain Pickings (archive)", desc: "Classic essays on creativity and life", cat: "articles" },

  // Additional solid entries to reach ~150+
  { url: "https://www.duolingo.com/", title: "Duolingo", desc: "Learn languages with addictive gamification", cat: "tools" },
  { url: "https://www.ankiweb.net/", title: "Anki", desc: "Spaced-repetition flashcards that actually work", cat: "tools" },
  { url: "https://www.khanacademy.org/", title: "Khan Academy", desc: "Free world-class education for anyone", cat: "science" },
  { url: "https://www.coursera.org/", title: "Coursera", desc: "University courses you can audit for free", cat: "articles" },
  { url: "https://www.ted.com/", title: "TED Talks", desc: "Ideas worth spreading — short and powerful", cat: "articles" },
  { url: "https://www.veritasium.com/", title: "Veritasium", desc: "Science and curiosity videos that stick", cat: "science" },
  { url: "https://www.kurzgesagt.org/", title: "Kurzgesagt", desc: "Beautifully animated explanations of big ideas", cat: "science" },
  { url: "https://www.radiolab.org/", title: "Radiolab", desc: "Audio storytelling that makes you rethink everything", cat: "articles" },
  { url: "https://www.npr.org/podcasts/", title: "NPR Podcasts", desc: "High-quality audio journalism and stories", cat: "articles" },
  { url: "https://www.bbc.co.uk/sounds", title: "BBC Sounds", desc: "World-class radio and podcasts", cat: "creative" },

  { url: "https://www.openstreetmap.org/", title: "OpenStreetMap", desc: "The free editable map of the world", cat: "tools" },
  { url: "https://www.openverse.org/", title: "Openverse", desc: "Search openly licensed images and audio", cat: "tools" },
  { url: "https://unsplash.com/", title: "Unsplash", desc: "Beautiful free photos for any project", cat: "tools" },
  { url: "https://www.pexels.com/", title: "Pexels", desc: "Free stock photos and videos", cat: "tools" },
  { url: "https://fontsinuse.com/", title: "Fonts In Use", desc: "Real-world typography inspiration", cat: "art" },
  { url: "https://www.typewolf.com/", title: "Typewolf", desc: "What’s trending in typography", cat: "art" },
  { url: "https://www.awwwards.com/websites/webgl/", title: "WebGL Awwwards", desc: "Best WebGL experiences on the web", cat: "art" },

  { url: "https://www.itchy-anime.com/", title: "Itchy Anime", desc: "Random anime recommendations", cat: "weird" },
  { url: "https://www.randomwebsite.com/", title: "Random Website", desc: "Another randomizer of obscure corners", cat: "weird" },
  { url: "https://www.stumbleupon.com/", title: "StumbleUpon (legacy feel)", desc: "Spiritual predecessor of random discovery", cat: "weird" },
  { url: "https://www.cloudhiker.com/", title: "Cloudhiker", desc: "Human-curated website discovery walks", cat: "interactive" },
  { url: "https://shouldseethis.com/", title: "Should See This", desc: "Hand-picked cool websites updated regularly", cat: "articles" },

  { url: "https://www.1000000checkboxes.com/", title: "One Million Checkboxes (alt)", desc: "Shared checkbox grid experiment", cat: "interactive" },
  { url: "https://www.arewethereyet.com/", title: "Are We There Yet?", desc: "A classic of internet humor", cat: "weird" },
  { url: "https://www.howmanypeopleareinspacerightnow.com/", title: "How Many People Are In Space", desc: "Live count of humans in orbit", cat: "science" },
  { url: "https://www.timeanddate.com/worldclock/", title: "World Clock", desc: "Clocks for every major city", cat: "tools" },
  { url: "https://www.worldtimebuddy.com/", title: "World Time Buddy", desc: "Easily compare time zones", cat: "tools" },

  { url: "https://www.palettegenerator.com/", title: "Palette Generator", desc: "Extract color palettes from images", cat: "tools" },
  { url: "https://coolors.co/", title: "Coolors", desc: "Generate beautiful color schemes in seconds", cat: "tools" },
  { url: "https://www.figma.com/community", title: "Figma Community", desc: "Free design resources and templates", cat: "tools" },
  { url: "https://www.canva.com/", title: "Canva", desc: "Design almost anything without being a designer", cat: "tools" },

  { url: "https://www.youtube.com/c/Vsauce", title: "Vsauce", desc: "Mind-bending questions about the universe", cat: "science" },
  { url: "https://www.youtube.com/c/CGPGrey", title: "CGP Grey", desc: "Clear explanations of complex systems", cat: "science" },
  { url: "https://www.youtube.com/c/TomScottGo", title: "Tom Scott", desc: "Curious facts and clever experiments", cat: "science" },

  { url: "https://www.wikimedia.org/", title: "Wikimedia", desc: "The free knowledge movement’s home", cat: "articles" },
  { url: "https://en.wikipedia.org/wiki/Special:Random", title: "Random Wikipedia", desc: "Jump to a completely random article", cat: "articles" },
  { url: "https://en.wikipedia.org/wiki/Portal:Contents", title: "Wikipedia Portals", desc: "Structured entry points into human knowledge", cat: "articles" },

  { url: "https://www.space.com/", title: "Space.com", desc: "News and features about the cosmos", cat: "science" },
  { url: "https://www.nature.com/", title: "Nature", desc: "Leading science journal and news", cat: "science" },
  { url: "https://www.scientificamerican.com/", title: "Scientific American", desc: "Accessible deep science writing", cat: "science" },

  { url: "https://www.behance.net/", title: "Behance", desc: "Creative portfolios from around the world", cat: "art" },
  { url: "https://dribbble.com/", title: "Dribbble", desc: "Design inspiration and community", cat: "art" },
  { url: "https://www.artstation.com/", title: "ArtStation", desc: "Professional art and concept design", cat: "art" },

  { url: "https://www.itch.io/", title: "itch.io", desc: "Independent games of every kind", cat: "games" },
  { url: "https://www.freeindiegam.es/", title: "Free Indie Games", desc: "Curated free experimental games", cat: "games" },
  { url: "https://www.newgrounds.com/", title: "Newgrounds", desc: "Classic flash games, art, and animation", cat: "games" },

  { url: "https://www.deviantart.com/", title: "DeviantArt", desc: "Long-running art community still full of gems", cat: "art" },
  { url: "https://www.tumblr.com/explore/trending", title: "Tumblr Explore", desc: "Still a place for weird and beautiful posts", cat: "creative" },

  { url: "https://www.are.na/", title: "Are.na", desc: "A calm, thoughtful place to collect ideas", cat: "tools" },
  { url: "https://www.notion.so/", title: "Notion", desc: "All-in-one workspace that many use as a second brain", cat: "tools" },
  { url: "https://obsidian.md/", title: "Obsidian", desc: "Local-first knowledge base with linked notes", cat: "tools" },

  { url: "https://www.producthunt.com/", title: "Product Hunt", desc: "Discover the newest tools and products daily", cat: "tools" },
  { url: "https://news.ycombinator.com/", title: "Hacker News", desc: "Tech and startup discussion with rabbit holes", cat: "articles" },
  { url: "https://lobste.rs/", title: "Lobsters", desc: "Computing-focused link aggregation", cat: "articles" },

  { url: "https://www.metafilter.com/", title: "MetaFilter", desc: "One of the oldest community weblogs still going", cat: "articles" },
  { url: "https://www.metafilter.com/popular.mefi", title: "MetaFilter Popular", desc: "Best of the best from the community", cat: "articles" },

  { url: "https://www.boingboing.net/", title: "Boing Boing", desc: "A directory of wonderful things", cat: "articles" },
  { url: "https://www.kottke.org/tag/best-of", title: "Kottke Best Of", desc: "Highlights from years of interesting finds", cat: "articles" },

  { url: "https://www.theatlantic.com/", title: "The Atlantic", desc: "Long-form journalism worth reading slowly", cat: "articles" },
  { url: "https://www.newyorker.com/", title: "The New Yorker", desc: "Fiction, essays, and cartoons of high quality", cat: "articles" },
  { url: "https://www.lrb.co.uk/", title: "London Review of Books", desc: "Serious long-form book reviews and essays", cat: "articles" },

  { url: "https://www.poetryfoundation.org/", title: "Poetry Foundation", desc: "Poems, poets, and the art of language", cat: "art" },
  { url: "https://www.gutenberg.org/ebooks/search/?sort_order=downloads", title: "Gutenberg Top Downloads", desc: "Most-loved free public-domain books", cat: "articles" },

  { url: "https://www.loc.gov/", title: "Library of Congress", desc: "American memory and vast digital collections", cat: "articles" },
  { url: "https://www.europeana.eu/", title: "Europeana", desc: "European cultural heritage digitized", cat: "art" },
  { url: "https://www.rijksmuseum.nl/en", title: "Rijksmuseum", desc: "Dutch masters and interactive collections", cat: "art" },
  { url: "https://www.metmuseum.org/", title: "The Met", desc: "Explore the Metropolitan Museum’s collection", cat: "art" },
  { url: "https://www.moma.org/", title: "MoMA", desc: "Modern art and design online", cat: "art" },

  { url: "https://www.nasa.gov/", title: "NASA", desc: "Official space agency site full of wonder", cat: "science" },
  { url: "https://www.esa.int/", title: "ESA", desc: "European Space Agency missions and images", cat: "science" },
  { url: "https://www.jpl.nasa.gov/", title: "NASA JPL", desc: "Jet Propulsion Laboratory — planetary exploration", cat: "science" },

  { url: "https://www.noaa.gov/", title: "NOAA", desc: "Earth’s weather, oceans, and climate", cat: "science" },
  { url: "https://www.usgs.gov/", title: "USGS", desc: "Earth science and natural hazards", cat: "science" },

  { url: "https://www.screamingfrog.co.uk/", title: "Screaming Frog", desc: "SEO spider tool (free version available)", cat: "tools" },
  { url: "https://web.dev/", title: "web.dev", desc: "Guidance for building modern, fast websites", cat: "tools" },
  { url: "https://developer.mozilla.org/", title: "MDN Web Docs", desc: "The definitive reference for web technologies", cat: "tools" },

  { url: "https://www.css-tricks.com/", title: "CSS-Tricks", desc: "Practical CSS and front-end techniques", cat: "tools" },
  { url: "https://www.smashingmagazine.com/", title: "Smashing Magazine", desc: "Web design and development articles", cat: "articles" },

  { url: "https://www.awwwards.com/", title: "Awwwards Home", desc: "Daily inspiration from the best of the web", cat: "art" },
  { url: "https://www.siteinspire.com/", title: "SiteInspire", desc: "Web design inspiration gallery", cat: "art" },
  { url: "https://land-book.com/", title: "Land-book", desc: "Landing page design inspiration", cat: "art" },

  { url: "https://www.figma.com/", title: "Figma", desc: "Collaborative interface design tool", cat: "tools" },
  { url: "https://www.sketch.com/", title: "Sketch", desc: "Digital design toolkit", cat: "tools" },

  { url: "https://www.replit.com/", title: "Replit", desc: "Collaborative coding in the browser", cat: "tools" },
  { url: "https://codepen.io/", title: "CodePen", desc: "Front-end playground and community", cat: "creative" },
  { url: "https://jsfiddle.net/", title: "JSFiddle", desc: "Test and share front-end snippets", cat: "tools" },

  { url: "https://www.observablehq.com/", title: "Observable", desc: "Reactive notebooks for data visualization", cat: "science" },
  { url: "https://d3js.org/", title: "D3.js", desc: "Data-driven documents — visualization library", cat: "creative" },

  { url: "https://www.p5js.org/", title: "p5.js", desc: "Creative coding library for artists and educators", cat: "creative" },
  { url: "https://processing.org/", title: "Processing", desc: "Flexible software sketchbook for visual art", cat: "creative" },

  { url: "https://www.openprocessing.org/", title: "OpenProcessing", desc: "Share and explore creative coding sketches", cat: "creative" },
  { url: "https://editor.p5js.org/", title: "p5.js Web Editor", desc: "Code and run sketches in the browser", cat: "creative" },

  { url: "https://www.shadertoy.com/view/Xds3zN", title: "Shadertoy Classic", desc: "A famous raymarching demo to explore", cat: "creative" },
  { url: "https://www.iquilezles.org/", title: "Inigo Quilez", desc: "Shader and math wizard’s personal site", cat: "science" },

  { url: "https://www.redblobgames.com/", title: "Red Blob Games", desc: "Excellent interactive explanations of algorithms", cat: "science" },
  { url: "https://www.cs.usfca.edu/~galles/visualization/", title: "Data Structure Visualizations", desc: "Watch algorithms and data structures in action", cat: "science" },

  { url: "https://algorithm-visualizer.org/", title: "Algorithm Visualizer", desc: "Interactive algorithm animations", cat: "science" },
  { url: "https://visualgo.net/", title: "VisuAlgo", desc: "Visualizing data structures and algorithms", cat: "science" },

  { url: "https://www.draw.io/", title: "diagrams.net", desc: "Free diagramming tool that works offline", cat: "tools" },
  { url: "https://www.tldraw.com/", title: "tldraw", desc: "Infinite canvas whiteboard", cat: "tools" },
  { url: "https://www.eraser.io/", title: "Eraser", desc: "Diagrams as code and collaborative whiteboarding", cat: "tools" },

  { url: "https://www.mermaidchart.com/", title: "Mermaid Chart", desc: "Create diagrams from text descriptions", cat: "tools" },
  { url: "https://www.plantuml.com/", title: "PlantUML", desc: "Text-based diagram generation", cat: "tools" },

  { url: "https://www.regex101.com/", title: "Regex101", desc: "Test and debug regular expressions live", cat: "tools" },
  { url: "https://www.jsonformatter.org/", title: "JSON Formatter", desc: "Pretty-print and validate JSON", cat: "tools" },
  { url: "https://jwt.io/", title: "JWT.io", desc: "Decode and debug JSON Web Tokens", cat: "tools" },

  { url: "https://www.caniuse.com/", title: "Can I Use", desc: "Browser support tables for web features", cat: "tools" },
  { url: "https://www.w3schools.com/", title: "W3Schools", desc: "Practical web development tutorials", cat: "tools" },
  { url: "https://www.freecodecamp.org/", title: "freeCodeCamp", desc: "Learn to code with free interactive curriculum", cat: "tools" },

  { url: "https://www.codecademy.com/", title: "Codecademy", desc: "Interactive coding lessons", cat: "tools" },
  { url: "https://www.theodinproject.com/", title: "The Odin Project", desc: "Full-stack curriculum that is completely free", cat: "tools" },

  { url: "https://www.leetcode.com/", title: "LeetCode", desc: "Coding interview practice problems", cat: "games" },
  { url: "https://www.codewars.com/", title: "Codewars", desc: "Improve coding skills with kata challenges", cat: "games" },
  { url: "https://www.hackerrank.com/", title: "HackerRank", desc: "Practice coding and prepare for interviews", cat: "games" },

  { url: "https://www.adventofcode.com/", title: "Advent of Code", desc: "Annual December programming puzzles", cat: "games" },
  { url: "https://projecteuler.net/", title: "Project Euler", desc: "Mathematical programming challenges", cat: "games" },

  { url: "https://www.chess.com/", title: "Chess.com", desc: "Play chess against people or AI", cat: "games" },
  { url: "https://lichess.org/", title: "Lichess", desc: "Free open-source chess platform", cat: "games" },
  { url: "https://www.chess.com/puzzles", title: "Chess Puzzles", desc: "Daily tactical puzzles to sharpen your mind", cat: "games" },

  { url: "https://www.sudoku.com/", title: "Sudoku.com", desc: "Classic number puzzles", cat: "games" },
  { url: "https://www.nytimes.com/crosswords", title: "NYT Crossword", desc: "The famous daily crossword", cat: "games" },
  { url: "https://www.nytimes.com/games/wordle", title: "Wordle", desc: "Guess the five-letter word in six tries", cat: "games" },
  { url: "https://www.nytimes.com/games/connections", title: "Connections", desc: "Group words that share a common theme", cat: "games" },

  { url: "https://www.sporcle.com/", title: "Sporcle", desc: "Trivia quizzes on every subject imaginable", cat: "games" },
  { url: "https://www.jetpunk.com/", title: "JetPunk", desc: "Geography and general knowledge quizzes", cat: "games" },
  { url: "https://www.geoguessr.com/battle-royale", title: "GeoGuessr Battle Royale", desc: "Competitive location guessing", cat: "games" },

  { url: "https://www.skribbl.io/", title: "Skribbl.io", desc: "Multiplayer drawing and guessing game", cat: "games" },
  { url: "https://garticphone.com/", title: "Gartic Phone", desc: "Telephone game with drawings", cat: "games" },
  { url: "https://www.drawasaurus.org/", title: "Drawasaurus", desc: "Another fun multiplayer drawing game", cat: "games" },

  { url: "https://www.agar.io/", title: "Agar.io", desc: "Eat or be eaten in a multiplayer blob world", cat: "games" },
  { url: "https://www.slither.io/", title: "Slither.io", desc: "Grow your snake by eating others", cat: "games" },

  { url: "https://www.krunker.io/", title: "Krunker.io", desc: "Fast-paced browser FPS", cat: "games" },
  { url: "https://www.shellshock.io/", title: "Shell Shockers", desc: "Egg-themed multiplayer shooter", cat: "games" },

  { url: "https://www.roblox.com/", title: "Roblox", desc: "User-generated games and experiences", cat: "games" },
  { url: "https://www.minecraft.net/", title: "Minecraft", desc: "The endless creative and survival sandbox", cat: "games" },

  { url: "https://www.store.steampowered.com/explore/", title: "Steam Explore", desc: "Discover new games and free weekends", cat: "games" },
  { url: "https://www.gog.com/", title: "GOG", desc: "DRM-free classic and indie games", cat: "games" },

  { url: "https://www.humblebundle.com/", title: "Humble Bundle", desc: "Pay-what-you-want game and book bundles", cat: "games" },
  { url: "https://www.itch.io/games/free", title: "itch.io Free Games", desc: "Thousands of free indie games", cat: "games" },
];

const DEEPER_SITES = [
  { url: "https://www.windows93.net/", title: "Windows 93", desc: "A fever dream operating system", cat: "weird" },
  { url: "https://noclip.website/", title: "Noclip", desc: "Wander empty game worlds after the players left", cat: "interactive" },
  { url: "https://www.notpron.com/notpron/", title: "Notpron Level 1", desc: "Begin the hardest riddle game on the internet", cat: "games" },
  { url: "https://www.theuselesswebindex.com/", title: "Useless Web Index", desc: "Deeper archive of pointless sites", cat: "weird" },
  { url: "https://www.geocities.ws/area51/", title: "GeoCities Area 51", desc: "Preserved 90s personal pages", cat: "weird" },
  { url: "https://www.zombo.com/", title: "Zombo.com (again)", desc: "You can do anything at Zombo.com", cat: "weird" },
  { url: "https://www.rrrrrrrrr.com/", title: "Rrrrrrrrr", desc: "Pure R", cat: "weird" },
  { url: "https://www.omfgdogs.com/", title: "OMFG Dogs", desc: "Spinning dogs", cat: "weird" },
  { url: "https://www.staggeringbeauty.com/", title: "Staggering Beauty", desc: "The worm", cat: "weird" },
  { url: "https://www.fallingfalling.com/", title: "Falling Falling", desc: "Endless fall", cat: "weird" },
  { url: "https://www.heeeeeeeey.com/", title: "Heeeeeeeey", desc: "Hello forever", cat: "weird" },
  { url: "https://www.eelslap.com/", title: "Eel Slap", desc: "Slap", cat: "weird" },
  { url: "https://www.pointerpointer.com/", title: "Pointer Pointer", desc: "Always pointing", cat: "weird" },
  { url: "https://www.cat-bounce.com/", title: "Cat Bounce", desc: "Cats", cat: "weird" },
  { url: "https://www.koalastothemax.com/", title: "Koalas to the Max", desc: "Reveal the koala", cat: "art" },
  { url: "https://zoomquilt.org/", title: "Zoomquilt", desc: "Infinite zoom", cat: "art" },
  { url: "https://www.thisissand.com/", title: "This Is Sand", desc: "Digital sand", cat: "creative" },
  { url: "https://patatap.com/", title: "Patatap", desc: "Keyboard symphony", cat: "creative" },
  { url: "https://www.boredbutton.com/", title: "Bored Button", desc: "Instant activity roulette", cat: "weird" },
  { url: "https://www.pointlesssites.com/", title: "Pointless Sites", desc: "Directory of the pointless", cat: "weird" },
  { url: "https://www.thequietplaceproject.com/thequietplace", title: "The Quiet Place", desc: "Leave a message for no one", cat: "interactive" },
  { url: "https://www.drawastickman.com/", title: "Draw a Stickman", desc: "Your drawing becomes the hero", cat: "games" },
  { url: "https://www.linusakesson.net/scene/longcat/", title: "Longcat", desc: "How long is long?", cat: "weird" },
  { url: "https://www.arewethereyet.com/", title: "Are We There Yet?", desc: "Classic", cat: "weird" },
  { url: "https://www.howmanypeopleareinspacerightnow.com/", title: "People in Space", desc: "Live orbital human count", cat: "science" },
  { url: "https://www.thispersondoesnotexist.com/", title: "This Person Does Not Exist", desc: "Faces that never were", cat: "weird" },
  { url: "https://www.thiswaifudoesnotexist.net/", title: "This Waifu Does Not Exist", desc: "Anime that never was", cat: "weird" },
  { url: "https://www.shadertoy.com/", title: "Shadertoy", desc: "GPU art community", cat: "creative" },
  { url: "https://www.iquilezles.org/www/index.htm", title: "Inigo Quilez Articles", desc: "Deep shader and math writings", cat: "science" },
  { url: "https://www.redblobgames.com/", title: "Red Blob Games", desc: "Beautiful algorithm explanations", cat: "science" },
];

const CATEGORIES = ["all", "tools", "games", "articles", "weird", "interactive", "creative", "science", "art"];

const LOADING_PHRASES = [
  "Diving into the void…",
  "Finding something weird…",
  "Hope you brought a map",
  "Consulting the digital oracle…",
  "Unraveling a new thread…",
  "The web is whispering…",
  "Opening a random door…",
  "Curiosity is loading…",
  "Somewhere interesting awaits…",
  "Falling down a rabbit hole…",
  "The algorithm of wonder spins…",
  "Preparing mild chaos…",
  "A gem is being selected…",
  "Your next obsession is near…",
  "The internet is vast…",
];
