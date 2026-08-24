const CONFIG = {
    // ==============================
    // APP / BRANDING
    // ==============================
    appName: "e-Nong Chik Pro",
    schoolCode: "SKNC",
    schoolName: "SK Nong Chik",
    schoolMotto: "Benar • Jujur",

    // ==============================
    // TEACHER INFORMATION
    // ==============================
    teacherName: "Cikgu Athira",
    teacherInitials: "CA",
    teacherRole: "Portal Guru",
    teacherPosition: "Guru Mata Pelajaran",

    // ==============================
    // SUPABASE
    // ==============================
    supabaseUrl: "https://vsrhclpbwuhtvxrtydgs.supabase.co",
    supabaseKey: "sb_publishable_63UGYbCjW_fVSoVRT5tmgQ_Nx4nzr41"
};

function applyConfig() {

    // Browser title
    document.title =
        `${CONFIG.appName} — Portal ${CONFIG.teacherName}`;

    // Header
    const appName = document.getElementById("appName");
    const schoolCode = document.getElementById("schoolCode");
    const schoolName = document.getElementById("schoolName");
    const schoolMotto = document.getElementById("schoolMotto");

    if (appName) appName.textContent = CONFIG.appName;
    if (schoolCode) schoolCode.textContent = CONFIG.schoolCode;
    if (schoolName) schoolName.textContent = CONFIG.schoolName;
    if (schoolMotto) schoolMotto.textContent = CONFIG.schoolMotto;

    // Teacher profile
    const teacherInitials =
        document.getElementById("teacherInitials");

    const teacherName =
        document.getElementById("teacherName");

    const teacherRole =
        document.getElementById("teacherRole");

    if (teacherInitials)
        teacherInitials.textContent = CONFIG.teacherInitials;

    if (teacherName)
        teacherName.textContent = CONFIG.teacherName;

    if (teacherRole)
        teacherRole.textContent = CONFIG.teacherRole;

    // Dashboard
    const dashboardSchoolInfo =
        document.getElementById("dashboardSchoolInfo");

    const dashboardTeacherName =
        document.getElementById("dashboardTeacherName");

    if (dashboardSchoolInfo) {
        dashboardSchoolInfo.textContent =
            `${CONFIG.schoolName.toUpperCase()} • ${CONFIG.schoolMotto.toUpperCase()}`;
    }

    if (dashboardTeacherName) {
        dashboardTeacherName.textContent =
            CONFIG.teacherName;
    }
}

document.addEventListener("DOMContentLoaded", applyConfig);
});
