// ==========================================
// MODULE 2 — KERJA RUMAH
// ==========================================


// ==========================================
// RENDER DROPDOWN KERJA RUMAH
// ==========================================

function renderKerjaRumahDropdowns() {

    const selectKelas =
        document.getElementById('krKelasSelect');

    const selectSubjek =
        document.getElementById('krSubjekSelect');

    if (!selectKelas || !selectSubjek) return;


    // ==============================
    // KELAS
    // ==============================

    let classes = [
        ...new Set(
            muridList
                .map(m =>
                    (m.kelas || '').trim()
                )
                .filter(Boolean)
        )
    ].sort();


    let currentKelas =
        selectKelas.value;


    selectKelas.innerHTML =
        '<option value="Semua">-- Semua Kelas --</option>';


    classes.forEach(c => {

        selectKelas.innerHTML +=
            `<option value="${c}">${c}</option>`;

    });


    if (classes.includes(currentKelas)) {
        selectKelas.value = currentKelas;
    }


    // ==============================
    // SUBJEK
    // ==============================

    let subjects = [
        ...new Set(
            kerjaRumahList
                .map(item =>
                    (item.subjek || '').trim()
                )
                .filter(Boolean)
        )
    ].sort();


    let currentSubjek =
        selectSubjek.value;


    selectSubjek.innerHTML =
        '<option value="Semua">-- Semua Subjek --</option>';


    subjects.forEach(subject => {

        selectSubjek.innerHTML +=
            `<option value="${subject}">${subject}</option>`;

    });


    if (subjects.includes(currentSubjek)) {
        selectSubjek.value = currentSubjek;
    }
}


// ==========================================
// TAMBAH TUGASAN PUKAL
// ==========================================

async function tambahTugasanPukal() {

    const kelas =
        document.getElementById(
            'krKelasSelect'
        ).value;


    const subjek =
        document.getElementById(
            'krSubjekSelect'
        ).value;


    const tarikh =
        document.getElementById(
            'krTarikh'
        ).value;


    const tugasan =
        document.getElementById(
            'krTugasan'
        ).value.trim();


    if (!tugasan) {

        alert(
            'Sila masukkan tugasan terlebih dahulu.'
        );

        return;
    }


    let filteredMurid =
        (kelas === 'Semua')
            ? muridList
            : muridList.filter(
                m =>
                    (m.kelas || '').trim() === kelas
            );


    if (filteredMurid.length === 0) {

        alert(
            'Tiada murid dijumpai untuk kelas tersebut.'
        );

        return;
    }


    let payload =
        filteredMurid.map(m => ({
            nama: m.nama,
            kelas: m.kelas,
            subjek: subjek,
            tarikh: tarikh,
            tugasan: tugasan,
            status: 'Belum Siap',
            catatan: ''
        }));


    const {
        error
    } = await db
        .from('kerja_rumah')
        .insert(payload);


    if (error) {

        alert(
            'Gagal menambah tugasan: ' +
            error.message
        );

        return;
    }


    alert(
        'Tugasan berjaya ditambah!'
    );


    document.getElementById(
        'krTugasan'
    ).value = '';


    await loadDataFromSupabase();
}


// ==========================================
// RENDER SENARAI KERJA RUMAH
// ==========================================

function renderKerjaRumah() {

    const body =
        document.getElementById(
            'senaraiKerjaRumahBody'
        );

    if (!body) return;


    const filterKelas =
        document.getElementById(
            'krFilterKelasSelect'
        )?.value || 'Semua';


    const filterSubjek =
        document.getElementById(
            'krFilterSubjekSelect'
        )?.value || 'Semua';


    let filteredData =
        kerjaRumahList.filter(item => {

            const matchKelas =
                filterKelas === 'Semua' ||
                (item.kelas || '').trim() === filterKelas;


            const matchSubjek =
                filterSubjek === 'Semua' ||
                (item.subjek || '').trim() === filterSubjek;


            return matchKelas && matchSubjek;
        });


    body.innerHTML = '';


    if (filteredData.length === 0) {

        body.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center; padding:30px;">
                    Tiada rekod kerja rumah.
                </td>
            </tr>
        `;

        return;
    }


    filteredData.forEach((item, index) => {

        body.innerHTML += `
            <tr>

                <td>${index + 1}</td>

                <td>
                    <strong>${item.nama || '-'}</strong>
                </td>

                <td>
                    ${item.kelas || '-'}
                </td>

                <td>
                    ${item.subjek || '-'}
                </td>

                <td>
                    ${item.tugasan || '-'}
                </td>

                <td>

                    <select
                        class="form-control"
                        onchange="kemaskiniStatusKR(
                            '${item.id}',
                            this.value
                        )"
                    >

                        <option
                            value="Belum Siap"
                            ${item.status === 'Belum Siap'
                                ? 'selected'
                                : ''}
                        >
                            Belum Siap
                        </option>

                        <option
                            value="Siap"
                            ${item.status === 'Siap'
                                ? 'selected'
                                : ''}
                        >
                            Siap
                        </option>

                    </select>

                </td>

                <td>

                    <input
                        type="text"
                        class="form-control"
                        value="${item.catatan || ''}"
                        onchange="kemaskiniCatatanKR(
                            '${item.id}',
                            this.value
                        )"
                    >

                </td>

            </tr>
        `;

    });
}


// ==========================================
// KEMASKINI STATUS KERJA RUMAH
// ==========================================

async function kemaskiniStatusKR(
    id,
    status
) {

    const {
        error
    } = await db
        .from('kerja_rumah')
        .update({
            status: status
        })
        .eq('id', id);


    if (error) {

        alert(
            'Gagal mengemaskini status: ' +
            error.message
        );

        return;
    }


    await loadDataFromSupabase();
}


// ==========================================
// KEMASKINI CATATAN KERJA RUMAH
// ==========================================

async function kemaskiniCatatanKR(
    id,
    catatan
) {

    const {
        error
    } = await db
        .from('kerja_rumah')
        .update({
            catatan: catatan
        })
        .eq('id', id);


    if (error) {

        alert(
            'Gagal mengemaskini catatan: ' +
            error.message
        );

        return;
    }


    await loadDataFromSupabase();
}


// ==========================================
// PADAM KERJA RUMAH
// ==========================================

async function padamKR(id) {

    if (
        !confirm(
            'Adakah anda pasti mahu memadam rekod ini?'
        )
    ) {
        return;
    }


    const {
        error
    } = await db
        .from('kerja_rumah')
        .delete()
        .eq('id', id);


    if (error) {

        alert(
            'Gagal memadam rekod: ' +
            error.message
        );

        return;
    }


    await loadDataFromSupabase();
}
