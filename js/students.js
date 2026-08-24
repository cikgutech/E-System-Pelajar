// ==========================================
// MODULE 3 — MAKLUMAT MURID
// ==========================================


// ==========================================
// RENDER SENARAI MURID
// ==========================================

function renderMurid() {

    let muridFilterKelas =
        document.getElementById(
            'muridFilterKelasSelect'
        )?.value || 'Semua';

    let mBody =
        document.getElementById(
            'senaraiMuridBody'
        );

    if (!mBody) return;

    mBody.innerHTML = '';


    let filteredMuridList =
        (muridFilterKelas === 'Semua')
            ? muridList
            : muridList.filter(
                m =>
                    (m.kelas || '').trim() ===
                    muridFilterKelas
            );


    filteredMuridList.forEach(
        (m, index) => {

            mBody.innerHTML += `
                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${m.nama}
                        </strong>
                    </td>

                    <td>
                        <span class="badge-smk">
                            ${m.kelas || '-'}
                        </span>
                    </td>

                    <td>
                        ${m.bapa || '-'}
                    </td>

                    <td>
                        ${m.tel || '-'}
                    </td>

                    <td class="no-print">

                        <button
                            onclick="padamMurid(${m.id})"
                            style="
                                color:red;
                                border:none;
                                background:none;
                                cursor:pointer;
                            "
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </td>

                </tr>
            `;
        }
    );
}


// ==========================================
// TAMBAH MURID
// ==========================================

async function tambahMurid() {

    let nama =
        document.getElementById(
            'mNama'
        ).value;

    let kelas =
        document.getElementById(
            'mKelasInput'
        ).value;

    let bapa =
        document.getElementById(
            'mBapa'
        ).value;

    let tel =
        document.getElementById(
            'mTel'
        ).value;


    if (nama && kelas) {

        const {
            error
        } = await db
            .from('murid')
            .insert([
                {
                    nama: nama.trim(),
                    kelas: kelas.trim(),
                    bapa: bapa || '-',
                    tel: tel || '-'
                }
            ]);


        if (error) {

            alert(
                'Gagal menambah murid: ' +
                error.message
            );

        } else {

            document.getElementById(
                'mNama'
            ).value = '';

            document.getElementById(
                'mKelasInput'
            ).value = '';

            document.getElementById(
                'mBapa'
            ).value = '';

            document.getElementById(
                'mTel'
            ).value = '';


            await loadDataFromSupabase();

            renderMurid();
        }

    } else {

        alert(
            'Sila masukkan Nama Murid dan Nama Kelas.'
        );
    }
}


// ==========================================
// PADAM MURID
// ==========================================

async function padamMurid(id) {

    if (
        confirm(
            'Padam rekod murid ini?'
        )
    ) {

        await db
            .from('murid')
            .delete()
            .eq('id', id);


        await loadDataFromSupabase();

        renderMurid();
    }
}
