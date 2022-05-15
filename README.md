# Documentație Aplicație

### [Link Video](https://youtu.be/K4l1gN1tMJ0)

## Introducere
Conform unui articol al National Institute of Standards and Technology, Cloud Computing este un concept modern bazat pe virtualizare care furnizează servicii IaaS (Infrastructure as a Service), PaaS (Platform as a Service), SaaS (Software as a Service) prin Internet. Principalul său rol este de a permite accesul la rețeaua de comunicații omniprezente, convenabile și la cerere, la resurse de calcul configurabile (de exemplu: rețele, servere, stocare date, aplicații și servicii). Acestea pot fi rapid furnizate și lansate cu efort minim de management sau interacțiune cu furnizorii de servicii.
## Descriere problemă
Problema propusa spre rezolvare este cautarea unei melodii care este disponibila pe Spotify pe baza titlului si/sau artistului, precum si afisarea versurilor aferente acesteia. 
Pentru rezolvarea acestei probleme am utilizat Spotify API pentru autorizarea aplicatiei si cautarea unei melodii disponibila pe Spotify si lyrics.ovh pentru cautarea versurilor melodiei respective si afisarea acestora pe ecran.

## Descriere API
Un API (Application Programming Interface) este utilizat pentru a trimite date intre aplicatiile software. Un API REST utilizeaza request-uri HTTP pentru a gestiona datele, precum GET, PUT, POST, DELETE.

#### Lyrics.ovh API
Fiind un API public si gratuit, al carui scop este aducerea de versuri pentru o anumita melodie si un anumit artist, lyrics.ovh poate fi utilizat creand un request de tip GET ce are ca parametri numele artistului si titlul melodiei. Usurinta si rapiditatea utilizarii sunt principalele motive ce m-au determinat sa aleg sa folosesc acest API, intrucat este nevoie doar de un request de tip GET la URL-ul specificat pentru a prelua versurile pentru melodia si artistul specificat.

```
 (async () => {
      const {
        data: { lyrics },
      } = await axios.get("https://api.lyrics.ovh/v1/" + playingTrack.artist + "/" + playingTrack.title);
      setLyrics(lyrics);
    })();
 ```
 #### Spotify API
Spotify API este un API gratuit pus la dispozitie de catre Spotify, ce poate fi accesat atat de aplicatii de tip web, cat si de aplicatii mobile. Printre functionalitatile premise de acesta se numara cautarea de melodii, artisti, preluarea de melodii si datele acestora, preluarea unui artist, a albumelor unui artist, preluarea melodiilor salvate de utilizator, preluarea de playlist-uri ale unui utilizator disponibile pe Spotify si multe altele.

Am utilizat Spotify API pentru a cauta melodii pe baza artistului si/sau titlului. Acesta ofera acces la datele utilizatorului, dar si la datele disponibile legate de melodiile si artistii aflati pe Spotify. Pentru a ne putea conecta aplicatia la API este nevoie sa ne inregistram pe https://developer.spotify.com/dashboard/login si sa cream o aplicatie pentru a primi un client_id si un client_secret ce vor fi folosite ulterior pentru a ne conecta la API. Tot aici este necesar sa furnizam aplicatiei un redirect_uri pentru ca API-ul sa stie unde sa ne redirecteze dupa ce realizeaza autorizarea, in cazul de fata va fi http://localhost:3000. 
 
Vom crea un request de tip POST pentru a ne autoriza aplicatia si a ne conecta la Spotify API. Ca si raspuns vom primi un acces_token, un refresh_token si un expires_in ce ne permit accesul la API. Token-ul primit are un timp de valabilitate, motiv pentru care primim ca si raspuns un refresh_token pentru a putea reface conexiunea si expires_in pentru a sti in cat timp expira.
```
useEffect(() => {
    (async () => {
      try {
        const {
          data: { access_token, refresh_token, expires_in },
        } = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, {
          code,
        });
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setExpiresIn(expires_in);
        window.history.pushState({}, null, '/');
      } catch {
        window.location = '/';
      }
    })();
  }, [code]);
  ```

## Flux de date
Fluxul de date intre backend si frontend se realizeaza cu ajutorul mecanismului request-response. Pentru codul de mai sus de conectare la API de pe frontend se utilizeaza biblioteca axios pentru a face legatura cu request-ul de pe backend.
Utilizand un obiect de tip SpotifyWebApi din pachetul spotify-web-api-node vom prelua codul de autorizare din body si vom astepta sa ni se aprobe accesul la API. Ca raspuns vom primi un acces_token si un request_token necesare pentru avea acces la API, dar si expires_in ce reprezinta in cat timp expira acces_token primit anterior. Toate acestea sunt trimise mai departe ca si raspuns si vor fi preluate ulterior pe partea de frontend.
```

spotifyLoginRouter.post('/', async (req, res) => {
    const { code } = req.body;
  
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });
  
    try {
      const {
        body: { access_token, refresh_token, expires_in },
      } = await spotifyApi.authorizationCodeGrant(code);
  
      res.json({ access_token, refresh_token, expires_in });
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  });
  ```
  Este de asemenea nevoie de un request de tip POST pentru a trata cazul expirarii token-ului de acces primit anterior. Astfel, se va prelua refresh token din body si folosi tot un obiect de tip SpotifyWebApi creat pe baza redirect URI, a client_id, client_secret si a token-ului de refresh pentru a se primi un nou token de acces. Ca si raspuns vor fi trimise noul token de acces creat si timpul in care expira acesta.
  
  ```
  spotifyRefreshTokenRouter.post('/', async (req, res) => {
    const { refreshToken } = req.body;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken,
    });
  
    try {
      const {
        body: { access_token, expires_in },
      } = await spotifyApi.refreshAccessToken();
      res.json({ access_token, expires_in });
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  });
  ```
  Pe partea de frontend vom utiliza biblioteca axios pentru a trimite request-ul de tip POST, realizandu-se astfel legatura intre backend si frontend. Vom astepta raspunsul primit si vom folosi token-ul nou primit in request pentru a seta un nou acces token si timpul nou de expirare al acestuia.
  
  ```
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(async () => {
      try {
        const {
          data: { access_token, expires_in },
        } = await axios.post(`${process.env.REACT_APP_BASE_URL}/refresh`, {
          refreshToken,
        });
        setAccessToken(access_token);
        setExpiresIn(expires_in);
      } catch {
        window.location = '/';
      }
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
};
  ```
## Capturi ecran aplicație
Aplicatia contine 3 pagini: pagina de start, pagina de cautare a unei melodii si pagina de afisare a versurilor melodiei selectate. Aceasta porneste cu pagina de start, unde avem optiunea de a ne conecta la Spotify.
![Pagina start](pagina_start.png)

Urmatoarea pagina ne ofera optiunea de a cauta melodii utilizand Spotify API, pe baza de artist si/sau titlul melodiei. In input-ul de tip search putem introduce un anumit keyword reprezentand numele artistului sau al melodiei si vor fi afisate rezultatele gasite pe Spotify, impreuna cu imaginea disponibila.

![Pagina Cautare melodie](pagina_cautare_melodie.png)

Atunci cand selectam o melodie vom fi redirectionati catre pagina de afisare a versurilor pentru melodia respectiva. Asteptam sa se realizeze request-ul catre Lyrics.ovh API, iar versurile vor fi afisate de indata ce se primeste un raspuns.
![Pagina Afisare versuri melodie](pagina_afisare_versuri.png)
## Referințe
* [Articol NIST](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf)
* [Lyrics.ovh API](https://github.com/public-apis/public-apis)
* [Lyrics.ovh API Website](https://lyricsovh.docs.apiary.io/#)
* [Spotify API](https://developer.spotify.com/documentation/web-api/quick-start/)
* [Despre API](https://support.apple.com/ro-ro/guide/shortcuts-mac/apd2e30c9d45/mac)
