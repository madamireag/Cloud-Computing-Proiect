# Documentație Aplicație

## Introducere

## Descriere problemă
Problema propusa spre rezolvare este cautarea unei melodii disponibila pe Spotify si afisarea versurilor acesteia. Pentru rezolvarea acestei probleme am utilizat Spotify API pentru autorizarea aplicatiei si cautarea unei melodii disponibila pe Spotify si lyrics.ovh pentru cautarea versurilor melodiei respective si afisarea acestora pe ecran.

## Descriere API


#### Lyrics.ovh API
Fiind un API al carui scop este aducerea de versuri pentru o anumita melodie si un anumit artist, lyrics.ovh poate fi utilizat creand un request de tip GET ce are ca parametri numele artistului si titlul melodiei. URL-ul prin care se poate realiza un request catre API este https://api.lyrics.ovh/v1/artist/title, unde artist si title sunt trimisi ca parametri. Utilizand biblioteca Axios am realizat un request catre API si a aduce versurile melodiei cautate anterior.

```
 (async () => {
      const {
        data: { lyrics },
      } = await axios.get("https://api.lyrics.ovh/v1/" + playingTrack.artist + "/" + playingTrack.title);
      setLyrics(lyrics);
    })();
    ```
## Flux de date

## Capturi ecran aplicație

## Referințe
