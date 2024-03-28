$(document).ready(() => {
  $(".scrollToTop").hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".scrollToTop").fadeIn();
      $(".scrollToTop").addClass("d-flex");
    } else {
      $(".scrollToTop").fadeOut();
      $(".scrollToTop").removeClass("d-flex");
    }
  });
  $(".scrollToTop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 100);
  });

  // Intersection Observer untuk mengubah warna navbar saat header muncul
  const heroElement = document.querySelector("header");
  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) {
        $("nav").addClass("bg-dark").attr("data-bs-theme", "dark");
      } else {
        $("nav").removeClass("bg-dark").removeAttr("data-bs-theme");
      }
    },
    { threshold: 0.9 }
  );
  observer.observe(heroElement);
  let nomorSurah = 0;
  $("#loader").hide();

  // Ajax untuk mengambil daftar surah dari API
  if ($("title").text() == "Al Quran Terjemahan") {
    $.ajax({
      url: "https://equran.id/api/v2/surat",
      type: "GET",
      success: function (res) {
        $("#loader").show();
        for (let i in res.data) {
          // Menambahkan tombol-tombol surah ke dalam #namaSurah
          $("#namaSurah").append(`
          <div class="col-sm-4 p-2">
          <a class="btn btn-outline-dark d-block px-3 py-3 w-100 text-start surah" id="surah${res.data[i].nomor}">
          <span class="no-surah">${res.data[i].nomor}</span>. ${res.data[i].namaLatin}
            </a>
          </div>
        `);
        }

        // Event handler untuk meng-handle klik pada tombol-tombol surah
        $(".surah").click(function () {
          nomorSurah = $(this).find(".no-surah").text();
          window.location.href = `./hasil/?nomorSurah=${nomorSurah}`;
        });
        $("#loader").hide();
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }
  nomorSurah = new URLSearchParams(window.location.search).get("nomorSurah");
  if (nomorSurah && $("title").text() != "Al Quran Terjemahan") {
    $.ajax({
      url: `https://equran.id/api/v2/surat/${nomorSurah}`,
      type: "GET",
      success: function (res) {
        $("#loader").show();
        if (nomorSurah != "1" && nomorSurah != "9") {
          $("#ayat").append(`<div class="ayat-list">
              <p></p>
              <p class="arabic mb-5">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
              <b><i class="latin">bismillāhir-raḥmānir-raḥīm(i).</i></b>
              <p class="arti">"Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."</p>
              <div class="btn-group me-2" role="group" aria-label="First group">
                  <button class="btn  px-1 py-0 toggleButton me-2" data-audio="audio-1"><i class="bi bi-play-fill"></i></button>
                  <audio src="https://equran.nos.wjv-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/001001.mp3" id="audio-1"></audio>
              </div>
              <hr />
              </div>`);
        }
        $("title").text(res.data.namaLatin);
        $("#surah-box").append(`
              <h2><span id="namaSurah">${res.data.namaLatin}</span> - <span class="arabic">${res.data.nama}</span></h2>
              <p>Surah ke-${res.data.nomor} - ${res.data.jumlahAyat} Ayat - ${res.data.tempatTurun}</p>
          `);
        for (i in res.data.ayat) {
          const audioSrc = res.data.ayat[i].audio["05"];
          const audioId = `audio${i}`;

          $("#ayat").append(`
              <div class="ayat-list">
              <p>${nomorSurah}-<span id="no-ayat">${res.data.ayat[i].nomorAyat}</span></p>
              <p class="arabic mb-5">${res.data.ayat[i].teksArab}</p>
              <b><i class="latin">${res.data.ayat[i].teksLatin}</i></b>
              <p class="arti">"${res.data.ayat[i].teksIndonesia}"</p>
              <div class="btn-group me-2" role="group" aria-label="First group">
                  <button class="btn  px-1 py-0 toggleButton me-2" data-audio="${audioId}"><i class="bi bi-play-fill"></i></button>
                  <button class="btn  px-1 py-0 copy-button ms-2" data-bs-toggle="modal" data-bs-target="#myModal"><i class="bi bi-copy"></i></button>
                  <audio src="${audioSrc}" id="${audioId}"></audio>
              </div>
              <hr />
              </div>
              `);
        }

        // Event handler untuk tombol "Copy"
        $(".copy-button").click(function () {
          // Menemukan teks yang akan disalin
          const textToCopy = `Allah Subhanahu Wa Ta'ala berfirman:\n\n${$(this).closest(".ayat-list").find(".arabic").text()}\n${$(this).closest(".ayat-list").find(".latin").text()}\n${$(this)
            .closest(".ayat-list")
            .find(".arti")
            .text()}\n(Q.S. ${$("#namaSurah").text()} - Ayat ${$(this).closest(".ayat-list").find("#no-ayat").text()})\n\nVia Al-Quran Terjemahan:\nhttps://al-quran-terjemahan.vercel.app/`;

          // Membuat elemen textarea sementara untuk menyalin teks
          const tempTextArea = $("<textarea>");
          $("body").append(tempTextArea);
          tempTextArea.val(textToCopy).select();

          // Menyalin teks ke papan klip
          document.execCommand("copy");

          // Menghapus elemen textarea sementara
          tempTextArea.remove();

          // Memberikan umpan balik kepada pengguna
          // alert("Teks berhasil disalin!");
          $("main").append(`<div class="modal" id="myModal">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
        
              <!-- Modal Header -->
              <div class="modal-header">
                <h4 class="modal-title">Success!</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
        
              <!-- Modal body -->
              <div class="modal-body">
                Teks Berhasil Disalin
              </div>
        
              <!-- Modal footer -->
              <div class="modal-footer">
                <button type="button" class="btn btn-dark d-block w-100" data-bs-dismiss="modal">Close</button>
              </div>
        
            </div>
          </div>
        </div>`);
        });

        // awal tombol audio
        $(".toggleButton").click(function () {
          const audioId = $(this).data("audio");
          const audio = document.getElementById(audioId);

          if (audio.paused) {
            audio.play();
            $(this).html('<i class="bi bi-pause-fill"></i>');
          } else {
            audio.pause();
            $(this).html('<i class="bi bi-play-fill"></i>');
          }

          audio.addEventListener("ended", function () {
            $(`[data-audio="${audioId}"]`).html('<i class="bi bi-play-fill"></i>');
          });
        });
        // akhir tombol audio

        $("#loader").hide();
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });

    if (nomorSurah == 1) {
      $("#suratSebelumnya").hide();
    } else if (nomorSurah == 114) {
      $("#suratSetelahnya").hide();
    }
    $("#suratSebelumnya").click(() => {
      window.location.href = `?nomorSurah=${eval(Number(nomorSurah) - 1)}`;
    });
    $("#suratSetelahnya").click(() => {
      window.location.href = `?nomorSurah=${eval(Number(nomorSurah) + 1)}`;
    });
  }
});
