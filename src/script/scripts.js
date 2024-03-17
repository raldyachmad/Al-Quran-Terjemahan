$("document").ready(() => {
  $("span.menu").click(() => {
    if ($("span.menu").text() == "menu") {
      $("span.menu").text("close");
    } else {
      $("span.menu").text("menu");
    }
    $(".box-menu").toggleClass("active");
  });
  let nomorSurah;

  $.ajax({
    url: "https://equran.id/api/v2/surat",
    type: "GET",
    success: function (res) {
      for (i in res.data) {
        // $(".box-menu").append(`<option value="${res.data[i].nomor}">${res.data[i].nomor}. ${res.data[i].namaLatin}</option>`);
        $("ul").append(`<li class="surah-item"><span class="no-surah">${res.data[i].nomor}</span>. ${res.data[i].namaLatin}</li>`);
      }
      $("li").click(function () {
        nomorSurah = $(this).find(".no-surah").text();
        $("li").removeClass("active-surah");
        $(this).addClass("active-surah");
        $.ajax({
          url: `https://equran.id/api/v2/surat/${nomorSurah}`,
          type: "GET",
          success: function (res) {
            $(".container").html("");
            $(".container").fadeOut();
            $(".container").fadeIn();
            $(".container").append(`<div class="surah-box"></div>
            <div class="container-ayat"></div>`);
            $(".surah-box").html("");
            $(".surah-box").append(`<h2 class="title">${res.data.namaLatin} - <span class="arabic">${res.data.nama}</span></h2><p>${res.data.nomor} - ${res.data.jumlahAyat} Ayat - ${res.data.tempatTurun}</p>`);
            $(".container-ayat").html("");
            if (nomorSurah != "1" && nomorSurah != "9") {
              $(".container-ayat").append(`<div class="ayah-list">
              <p></p>
              <p class="arabic">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
              <p class="latin">bismillāhir-raḥmānir-raḥīm(i).</p>
              <p class="arti">"Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."</p>
            </div><hr>`);
            }
            for (i in res.data.ayat) {
              $(".container-ayat").append(`<div class="ayah-list">
              <p>${nomorSurah}:${res.data.ayat[i].nomorAyat}</p>
              <p class="arabic">${res.data.ayat[i].teksArab}</p>
              <p class="latin">${res.data.ayat[i].teksLatin}</p>
              <p class="arti">"${res.data.ayat[i].teksIndonesia}"</p>
            </div><hr>`);
            }
          },
        });
      });
    },
  });
});
