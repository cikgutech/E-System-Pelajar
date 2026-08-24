// ==========================================
// MODULE 1 — KEHADIRAN
// ==========================================


// ==========================================
// RENDER KEHADIRAN HARIAN
// ==========================================

function renderKehadiranHarian() {

    let tarikhPilihan =
        document.getElementById('khTarikhHarian').value;

    let kelasPilihan =
        document.getElementById('khKelasSelect').value;

    let khBody =
        document.getElementById('senaraiKehadiranBody');

    if (!khBody) return;

    khBody.innerHTML = '';


    let filteredMurid =
        (kelasPilihan === 'Semua')
            ? muridList
            : muridList.filter(
                m =>
                    (m.kelas || '').trim() === kelasPilihan
            );


    let totalMurid =
        filteredMurid.length;

    let hadirCount = 0;


    filteredMurid.forEach((m, index) => {

        let statusTersimpan =
            (
                kehadiranData[tarikhPilihan] &&
                kehadiranData[tarikhPilihan][m.nama]
            )
                ? kehadiranData[tarikhPilihan][m.nama].status
                : 'Hadir';


        let catatanTersimpan =
            (
                kehadiranData[tarikhPilihan] &&
                kehadiranData[tarikhPilihan][m.nama]
            )
                ? kehadiranData[tarikhPilihan][m.nama].catatan
                : '';


        let isHadir =
            (
                statusTersimpan === 'Hadir' ||
                statusTersimpan === 'Lewat'
            );


        if (isHadir) {
            hadirCount++;
        }


        khBody.innerHTML += `
            <tr>

                <td>${index + 1}</td>

                <td>
                    <strong>${m.nama}</strong>
                </td>

                <td>
                    <span class="badge-smk">
                        ${m.kelas || '-'}
                    </span>
                </td>

                <td>

                    <div style="display:flex; gap:8px;">

                        <button
                            type="button"
                            class="btn btn-sm ${
                                isHadir
                                    ? 'btn-success'
                                    : 'btn-outline'
                            } btn-toggle-status"
                            data-nama="${m.nama}"
                            data-status="Hadir"
                            onclick="toggleStatusBtn(
                                this,
                                '${m.nama}',
                                'Hadir'
                            )"
                        >
                            <i class="fa-solid fa-check"></i>
                            Hadir
                        </button>


                        <button
                            type="button"
                            class="btn btn-sm ${
                                !isHadir
                                    ? 'btn-danger'
                                    : 'btn-outline'
                            } btn-toggle-status"
                            data-nama="${m.nama}"
                            data-status="Tidak Hadir"
                            onclick="toggleStatusBtn(
                                this,
                                '${m.nama}',
                                'Tidak Hadir'
                            )"
                        >
                            <i class="fa-solid fa-xmark"></i>
                            Tidak Hadir
                        </button>

                    </div>

                </td>

                <td>

                    <input
                        type="text"
                        placeholder="Tulis catatan (cth: Sakit, Kuarantin, Cuti)..."
                        class="form-control kh-catatan"
                        data-nama="${m.nama}"
                        value="${catatanTersimpan}"
                    >

                </td>

            </tr>
        `;
    });


    let peratus =
        totalMurid > 0
            ? Math.round(
                (hadirCount / totalMurid) * 100
            )
            : 0;


    document.getElementById(
        'khPeratusText'
    ).innerText =
        peratus + '%';


    document.getElementById(
        'statPeratus'
    ).innerText =
        peratus + '%';
}


// ==========================================
// TOGGLE STATUS KEHADIRAN
// ==========================================

function toggleStatusBtn(
    btn,
    namaMurid,
    newStatus
) {

    let parentTd =
        btn.closest('td');

    let buttons =
        parentTd.querySelectorAll(
            '.btn-toggle-status'
        );


    buttons.forEach(b => {

        b.classList.remove(
            'btn-success',
            'btn-danger'
        );

        b.classList.add(
            'btn-outline'
        );

    });


    if (newStatus === 'Hadir') {

        btn.classList.remove(
            'btn-outline'
        );

        btn.classList.add(
            'btn-success'
        );

    } else {

        btn.classList.remove(
            'btn-outline'
        );

        btn.classList.add(
            'btn-danger'
        );
    }


    parentTd.setAttribute(
        'data-selected-status',
        newStatus
    );


    kiraSemulaPeratus();
}


// ==========================================
// KIRA SEMULA PERATUS
// ==========================================

function kiraSemulaPeratus() {

    let rows =
        document.querySelectorAll(
            '#senaraiKehadiranBody tr'
        );

    let total =
        rows.length;

    let hadir = 0;


    rows.forEach(row => {

        let activeGreenBtn =
            row.querySelector(
                '.btn-success'
            );

        if (activeGreenBtn) {
            hadir++;
        }

    });


    let peratus =
        total > 0
            ? Math.round(
                (hadir / total) * 100
            )
            : 0;


    document.getElementById(
        'khPeratusText'
    ).innerText =
        peratus + '%';


    document.getElementById(
        'statPeratus'
    ).innerText =
        peratus + '%';
}


// ==========================================
// SIMPAN KEHADIRAN
// ==========================================

async function simpanKehadiran() {

    let tarikh =
        document.getElementById(
            'khTarikhHarian'
        ).value;


    if (!tarikh) {

        alert(
            'Sila pilih tarikh terlebih dahulu.'
        );

        return;
    }


    let rows =
        document.querySelectorAll(
            '#senaraiKehadiranBody tr'
        );


    let mapPayload =
        new Map();


    rows.forEach(row => {

        let catatanInput =
            row.querySelector(
                '.kh-catatan'
            );


        let namaMurid =
            catatanInput.getAttribute(
                'data-nama'
            );


        let catatanVal =
            catatanInput.value;


        let isHadirActive =
            row.querySelector(
                '.btn-success'
            ) !== null;


        let statusVal =
            isHadirActive
                ? 'Hadir'
                : 'Tidak Hadir';


        mapPayload.set(
            namaMurid,
            {
                tarikh: tarikh,
                nama: namaMurid,
                status: statusVal,
                catatan: catatanVal
            }
        );

    });


    let payload =
        Array.from(
            mapPayload.values()
        );


    const {
        error
    } = await db
        .from('kehadiran')
        .upsert(
            payload,
            {
                onConflict: 'tarikh,nama'
            }
        );


    if (error) {

        alert(
            'Gagal menyimpan kehadiran: ' +
            error.message
        );

    } else {

        alert(
            `Kehadiran tarikh (${tarikh}) berjaya disimpan/dikemaskini!`
        );

        await loadDataFromSupabase();
    }
}
