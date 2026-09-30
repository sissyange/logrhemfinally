/* =========================================================
   CHURCHNOTES - UNIVERSAL APP.JS
   Profile + Settings + Dark Mode + Notifications
   ========================================================= */

(function () {
    "use strict";

    /* =========================================================
       STORAGE KEYS
    ========================================================= */

    const PROFILE_KEY = "churchNotesProfile";
    const DARK_MODE_KEY = "churchNotesDarkMode";
    const NOTIFICATIONS_KEY = "churchNotesNotifications";
    const NOTES_KEY = "churchNotes";
    const SCHEDULES_KEY = "churchNotesSchedules";
    const CUSTOM_SERVICES_KEY = "churchNotesCustomServices";


    /* =========================================================
       SAFE STORAGE HELPERS
    ========================================================= */

    function getStorage(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);

            return value === null
                ? fallback
                : value;

        } catch (error) {

            console.error(
                "Unable to read localStorage:",
                error
            );

            return fallback;
        }
    }


    function setStorage(key, value) {

        try {

            localStorage.setItem(
                key,
                value
            );

            return true;

        } catch (error) {

            console.error(
                "Unable to write localStorage:",
                error
            );

            return false;
        }
    }


    function getJSON(key, fallback = null) {

        try {

            const saved =
                localStorage.getItem(key);

            if (!saved) {
                return fallback;
            }

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Unable to read JSON:",
                error
            );

            return fallback;
        }
    }


    /* =========================================================
       PROFILE
    ========================================================= */

    function getProfile() {

        return getJSON(
            PROFILE_KEY,
            null
        );
    }

    window.getProfile =
        getProfile;


    /* =========================================================
       FIRST LETTER ONLY
    ========================================================= */

    function getInitials(fullName) {

        if (
            !fullName ||
            !String(fullName).trim()
        ) {

            return "👤";
        }

        return String(fullName)
            .trim()
            .charAt(0)
            .toUpperCase();
    }

    window.getInitials =
        getInitials;


    /* =========================================================
       FIRST NAME ONLY
    ========================================================= */

    function getFirstName(fullName) {

        if (
            !fullName ||
            !String(fullName).trim()
        ) {

            return "Friend";
        }

        return String(fullName)
            .trim()
            .split(/\s+/)[0];
    }

    window.getFirstName =
        getFirstName;


    /* =========================================================
       SUPPORT fullName AND name
    ========================================================= */

    function getProfileName(profile) {

        if (!profile) {
            return "";
        }

        return (
            profile.fullName ||
            profile.name ||
            ""
        )
            .toString()
            .trim();
    }


    /* =========================================================
       PROFILE FORM FIELDS
    ========================================================= */

    function setProfileFields(
        profile,
        disabled = false
    ) {

        const fields = [

            "fullName",
            "email",
            "phone",
            "birthday",
            "address",
            "church",
            "membership"

        ];


        fields.forEach(
            function (field) {

                const element =
                    document.getElementById(
                        field
                    );


                if (!element) {
                    return;
                }


                element.value =
                    profile &&
                    profile[field]
                        ? profile[field]
                        : "";


                element.disabled =
                    disabled;

            }
        );
    }

    window.setProfileFields =
        setProfileFields;


    /* =========================================================
       ENABLE PROFILE EDITING
    ========================================================= */

    function enableEditing() {

        const fields = [

            "fullName",
            "email",
            "phone",
            "birthday",
            "address",
            "church",
            "membership"

        ];


        fields.forEach(
            function (field) {

                const element =
                    document.getElementById(
                        field
                    );


                if (element) {

                    element.disabled =
                        false;
                }

            }
        );


        const saveButton =
            document.getElementById(
                "saveProfileBtn"
            );


        const editButton =
            document.getElementById(
                "editProfileBtn"
            );


        if (saveButton) {

            saveButton.style.display =
                "block";
        }


        if (editButton) {

            editButton.style.display =
                "none";
        }


        const fullName =
            document.getElementById(
                "fullName"
            );


        if (fullName) {

            fullName.focus();
        }
    }

    window.enableEditing =
        enableEditing;


    /* =========================================================
       SAVE PROFILE
    ========================================================= */

    function saveProfile() {

        const fullName =
            document.getElementById(
                "fullName"
            );


        if (!fullName) {
            return;
        }


        const name =
            fullName.value.trim();


        if (!name) {

            alert(
                "Please enter your full name."
            );

            fullName.focus();

            return;
        }


        const emailElement =
            document.getElementById(
                "email"
            );


        const phoneElement =
            document.getElementById(
                "phone"
            );


        const birthdayElement =
            document.getElementById(
                "birthday"
            );


        const addressElement =
            document.getElementById(
                "address"
            );


        const churchElement =
            document.getElementById(
                "church"
            );


        const membershipElement =
            document.getElementById(
                "membership"
            );


        /*
           Save both fullName and name
           for compatibility with all pages.
        */

        const profile = {

            fullName: name,

            name: name,

            email:
                emailElement
                    ? emailElement.value.trim()
                    : "",

            phone:
                phoneElement
                    ? phoneElement.value.trim()
                    : "",

            birthday:
                birthdayElement
                    ? birthdayElement.value
                    : "",

            address:
                addressElement
                    ? addressElement.value.trim()
                    : "",

            church:
                churchElement
                    ? churchElement.value.trim()
                    : "",

            membership:
                membershipElement
                    ? membershipElement.value.trim()
                    : ""

        };


        if (
            !setStorage(
                PROFILE_KEY,
                JSON.stringify(profile)
            )
        ) {

            alert(
                "Unable to save your profile."
            );

            return;
        }


        updateProfileInitials(
            name
        );


        setProfileFields(
            profile,
            true
        );


        const saveButton =
            document.getElementById(
                "saveProfileBtn"
            );


        const editButton =
            document.getElementById(
                "editProfileBtn"
            );


        if (saveButton) {

            saveButton.style.display =
                "none";
        }


        if (editButton) {

            editButton.style.display =
                "block";
        }


        updateSettingsProfileText();

        loadHomeProfile();


        alert(
            "Profile saved successfully!"
        );


        setTimeout(
            function () {

                if (
                    document.getElementById(
                        "profileInitials"
                    )
                ) {

                    window.location.href =
                        "home.html";
                }

            },
            300
        );
    }

    window.saveProfile =
        saveProfile;


    /* =========================================================
       UPDATE PROFILE INITIALS
    ========================================================= */

    function updateProfileInitials(
        fullName
    ) {

        const firstLetter =
            getInitials(
                fullName
            );


        const selectors = [

            "#profileInitials",
            "#homeProfileAvatar",
            "#profileAvatar"

        ];


        selectors.forEach(
            function (selector) {

                document
                    .querySelectorAll(
                        selector
                    )
                    .forEach(
                        function (element) {

                            element.textContent =
                                firstLetter;

                        }
                    );

            }
        );
    }

    window.updateProfileInitials =
        updateProfileInitials;


    /* =========================================================
       LOAD PROFILE PAGE
    ========================================================= */

    function loadProfilePage() {

        const profile =
            getProfile();


        const saveButton =
            document.getElementById(
                "saveProfileBtn"
            );


        const editButton =
            document.getElementById(
                "editProfileBtn"
            );


        if (!profile) {

            setProfileFields(
                null,
                false
            );


            if (saveButton) {

                saveButton.style.display =
                    "block";
            }


            if (editButton) {

                editButton.style.display =
                    "none";
            }


            updateProfileInitials("");

            return;
        }


        setProfileFields(
            profile,
            true
        );


        updateProfileInitials(
            getProfileName(
                profile
            )
        );


        if (saveButton) {

            saveButton.style.display =
                "none";
        }


        if (editButton) {

            editButton.style.display =
                "block";
        }
    }

    window.loadProfilePage =
        loadProfilePage;


    /* =========================================================
       LOAD HOME PROFILE
    ========================================================= */

    function loadHomeProfile() {

        const profile =
            getProfile();


        const welcomeName =
            document.getElementById(
                "welcomeName"
            );


        const avatarElements =
            document.querySelectorAll(
                "#homeProfileAvatar, #profileAvatar"
            );


        const name =
            getProfileName(
                profile
            );


        if (welcomeName) {

            welcomeName.textContent =
                name
                    ? getFirstName(name)
                    : "Friend";
        }


        avatarElements.forEach(
            function (element) {

                element.textContent =
                    name
                        ? getInitials(name)
                        : "👤";

            }
        );
    }

    window.loadHomeProfile =
        loadHomeProfile;


    /* =========================================================
       UNIVERSAL DARK MODE CSS
    ========================================================= */

    function injectUniversalDarkModeCSS() {

        if (
            document.getElementById(
                "churchNotesUniversalDarkCSS"
            )
        ) {

            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "churchNotesUniversalDarkCSS";


        style.textContent = `

        /* ==========================================
           UNIVERSAL DARK MODE
        ========================================== */

        html.churchnotes-dark,
        html.churchnotes-dark body,
        body.churchnotes-dark {

            background: #0e1218 !important;

            color: #edf2f7 !important;
        }


        body.churchnotes-dark
        .app,

        body.churchnotes-dark
        .settings-page,

        body.churchnotes-dark
        .profile-page,

        body.churchnotes-dark
        .notes-page,

        body.churchnotes-dark
        .schedule-page,

        body.churchnotes-dark
        .page,

        body.churchnotes-dark
        main {

            background-color:
                #151a22 !important;

            color:
                #edf2f7 !important;
        }


        /* CARDS */

        body.churchnotes-dark
        .card,

        body.churchnotes-dark
        .note-card,

        body.churchnotes-dark
        .service-card,

        body.churchnotes-dark
        .stat-card,

        body.churchnotes-dark
        .quick-card,

        body.churchnotes-dark
        .settings-item,

        body.churchnotes-dark
        .schedule-card,

        body.churchnotes-dark
        .calendar,

        body.churchnotes-dark
        .calendar-container,

        body.churchnotes-dark
        .profile-card,

        body.churchnotes-dark
        .info-card,

        body.churchnotes-dark
        .form-card,

        body.churchnotes-dark
        .modal,

        body.churchnotes-dark
        .modal-content,

        body.churchnotes-dark
        .empty-state,

        body.churchnotes-dark
        .note-detail-card,

        body.churchnotes-dark
        .form-container {

            background:
                #1d2430 !important;

            color:
                #edf2f7 !important;

            border-color:
                #303a49 !important;
        }


        /* HEADINGS */

        body.churchnotes-dark
        h1,

        body.churchnotes-dark
        h2,

        body.churchnotes-dark
        h3,

        body.churchnotes-dark
        h4,

        body.churchnotes-dark
        h5,

        body.churchnotes-dark
        h6 {

            color:
                #f2f5f8 !important;
        }


        /* TEXT */

        body.churchnotes-dark
        p,

        body.churchnotes-dark
        span,

        body.churchnotes-dark
        label,

        body.churchnotes-dark
        .title,

        body.churchnotes-dark
        .section-title,

        body.churchnotes-dark
        .settings-info h3,

        body.churchnotes-dark
        .service-name {

            color:
                #edf2f7;
        }


        /* SECONDARY TEXT */

        body.churchnotes-dark
        .subtitle,

        body.churchnotes-dark
        .section-subtitle,

        body.churchnotes-dark
        .service-day,

        body.churchnotes-dark
        .muted,

        body.churchnotes-dark
        small,

        body.churchnotes-dark
        .settings-info p {

            color:
                #a8b3c1 !important;
        }


        /* INPUTS */

        body.churchnotes-dark
        input,

        body.churchnotes-dark
        textarea,

        body.churchnotes-dark
        select {

            background:
                #111a2b !important;

            color:
                #f8fafc !important;

            border-color:
                #35435b !important;
        }


        body.churchnotes-dark
        input::placeholder,

        body.churchnotes-dark
        textarea::placeholder {

            color:
                #7f8ca0 !important;
        }


        /* BOTTOM NAV */

        body.churchnotes-dark
        .bottom-nav,

        body.churchnotes-dark
        nav.bottom-nav,

        body.churchnotes-dark
        .nav-bar {

            background:
                #1a2029 !important;

            border-color:
                #303a49 !important;
        }


        body.churchnotes-dark
        .nav-item {

            color:
                #8d99a9 !important;
        }


        body.churchnotes-dark
        .nav-item.active,

        body.churchnotes-dark
        .nav-item:hover {

            color:
                #65a7ff !important;
        }


        /* ICON BACKGROUNDS */

        body.churchnotes-dark
        .settings-icon,

        body.churchnotes-dark
        .quick-icon,

        body.churchnotes-dark
        .service-icon {

            background:
                #27344a !important;
        }


        /* MODALS */

        body.churchnotes-dark
        .modal-overlay {

            background:
                rgba(0,0,0,.68) !important;
        }


        body.churchnotes-dark
        .modal-close {

            background:
                #273349 !important;

            color:
                #dbe2ec !important;
        }


        /* BLUE HEADERS */

        body.churchnotes-dark
        .home-header,

        body.churchnotes-dark
        .settings-header,

        body.churchnotes-dark
        .profile-header,

        body.churchnotes-dark
        .notes-header,

        body.churchnotes-dark
        .schedule-header,

        body.churchnotes-dark
        .page-header {

            color:
                white !important;
        }


        /* HEADER TEXT */

        body.churchnotes-dark
        .home-header *,

        body.churchnotes-dark
        .settings-header *,

        body.churchnotes-dark
        .profile-header *,

        body.churchnotes-dark
        .notes-header *,

        body.churchnotes-dark
        .schedule-header *,

        body.churchnotes-dark
        .page-header * {

            color:
                white;
        }


        /* ==========================================
           AVATAR ALWAYS YELLOW + BLACK
        ========================================== */

        body.churchnotes-dark
        .profile-avatar,

        body.churchnotes-dark
        .avatar,

        body.churchnotes-dark
        #profileInitials,

        body.churchnotes-dark
        #homeProfileAvatar {

            background:
                #facc15 !important;

            color:
                #111111 !important;
        }

        `;


        document.head.appendChild(
            style
        );
    }


    /* =========================================================
       APPLY DARK MODE
    ========================================================= */

    function applyDarkMode() {

        const enabled =
            getStorage(
                DARK_MODE_KEY,
                "false"
            ) === "true";


        document.documentElement
            .classList
            .toggle(
                "churchnotes-dark",
                enabled
            );


        document.body
            .classList
            .toggle(
                "churchnotes-dark",
                enabled
            );


        /*
           Compatibility with your existing HTML.
        */

        document.body
            .classList
            .toggle(
                "dark-mode",
                enabled
            );


        document.body
            .classList
            .toggle(
                "dark",
                enabled
            );


        const toggle =
            document.getElementById(
                "darkModeToggle"
            );


        if (toggle) {

            toggle.checked =
                enabled;
        }
    }

    window.applyDarkMode =
        applyDarkMode;


    /* =========================================================
       TOGGLE DARK MODE
    ========================================================= */

    function toggleDarkMode() {

        const toggle =
            document.getElementById(
                "darkModeToggle"
            );


        const enabled =
            toggle
                ? toggle.checked
                : !(
                    getStorage(
                        DARK_MODE_KEY,
                        "false"
                    ) === "true"
                );


        setStorage(
            DARK_MODE_KEY,
            enabled
                ? "true"
                : "false"
        );


        applyDarkMode();
    }

    window.toggleDarkMode =
        toggleDarkMode;


    /* =========================================================
       NOTIFICATIONS
    ========================================================= */

    function loadNotificationSetting() {

        const saved =
            getStorage(
                NOTIFICATIONS_KEY,
                null
            );


        /*
           Default is ON.
        */

        const enabled =
            saved === null
                ? true
                : saved === "true";


        const toggle =
            document.getElementById(
                "notificationsToggle"
            );


        if (toggle) {

            toggle.checked =
                enabled;
        }
    }

    window.loadNotificationSetting =
        loadNotificationSetting;


    /* =========================================================
       TOGGLE NOTIFICATIONS
    ========================================================= */

    function toggleNotifications() {

        const toggle =
            document.getElementById(
                "notificationsToggle"
            );


        if (!toggle) {
            return;
        }


        setStorage(
            NOTIFICATIONS_KEY,
            toggle.checked
                ? "true"
                : "false"
        );
    }

    window.toggleNotifications =
        toggleNotifications;


    /* =========================================================
       CHECK NOTIFICATIONS
    ========================================================= */

    function areNotificationsEnabled() {

        return getStorage(
            NOTIFICATIONS_KEY,
            "true"
        ) === "true";
    }

    window.areNotificationsEnabled =
        areNotificationsEnabled;


    /* =========================================================
       BROWSER NOTIFICATION
    ========================================================= */

    function showChurchNotification(
        title,
        message
    ) {

        if (
            !areNotificationsEnabled()
        ) {

            return false;
        }


        if (
            "Notification" in window &&
            Notification.permission ===
                "granted"
        ) {

            try {

                new Notification(
                    title ||
                        "ChurchNotes",

                    {
                        body:
                            message ||
                            ""
                    }
                );

                return true;

            } catch (error) {

                console.error(
                    "Notification error:",
                    error
                );
            }
        }


        return false;
    }

    window.showChurchNotification =
        showChurchNotification;


    /* =========================================================
       REQUEST NOTIFICATION PERMISSION
    ========================================================= */

    function requestNotificationPermission() {

        if (
            !("Notification" in window)
        ) {

            return;
        }


        if (
            Notification.permission ===
            "default"
        ) {

            Notification
                .requestPermission()
                .catch(
                    function () {}
                );
        }
    }

    window.requestNotificationPermission =
        requestNotificationPermission;


    /* =========================================================
       SETTINGS PROFILE TEXT
    ========================================================= */

    function updateSettingsProfileText() {

        const element =
            document.getElementById(
                "profileSettingsText"
            );


        if (!element) {
            return;
        }


        const profile =
            getProfile();


        const name =
            getProfileName(
                profile
            );


        if (name) {

            element.textContent =
                "Edit your profile";

        } else {

            element.textContent =
                "Create your profile";
        }
    }

    window.updateSettingsProfileText =
        updateSettingsProfileText;


    /* =========================================================
       USER MANUAL
    ========================================================= */

    function openUserManual() {

        alert(

            "ChurchNotes User Manual\n\n" +

            "1. Home\n" +
            "View your church notes and services.\n\n" +

            "2. Notes\n" +
            "Create and manage your notes.\n\n" +

            "3. Schedule\n" +
            "View your church schedule.\n\n" +

            "4. Profile\n" +
            "Manage your personal information.\n\n" +

            "5. Settings\n" +
            "Manage Dark Mode and Notifications."

        );
    }

    window.openUserManual =
        openUserManual;


    /* =========================================================
       ABOUT
    ========================================================= */

    function openAbout() {

        alert(

            "ChurchNotes\n\n" +

            "A simple mobile application for " +
            "managing church notes, schedules, " +
            "and personal information."

        );
    }

    window.openAbout =
        openAbout;


    /* =========================================================
       HOME COUNTS
    ========================================================= */

    function updateHomeCounts() {

        const notes =
            getJSON(
                NOTES_KEY,
                []
            );


        const schedules =
            getJSON(
                SCHEDULES_KEY,
                []
            );


        const customServices =
            getJSON(
                CUSTOM_SERVICES_KEY,
                []
            );


        const notesCount =
            document.getElementById(
                "notesCount"
            );


        const scheduleCount =
            document.getElementById(
                "scheduleCount"
            );


        const servicesCount =
            document.getElementById(
                "servicesCount"
            );


        if (notesCount) {

            notesCount.textContent =
                Array.isArray(notes)
                    ? notes.length
                    : 0;
        }


        if (scheduleCount) {

            scheduleCount.textContent =
                Array.isArray(schedules)
                    ? schedules.length
                    : 0;
        }


        if (servicesCount) {

            servicesCount.textContent =
                5 +
                (
                    Array.isArray(
                        customServices
                    )
                        ? customServices.length
                        : 0
                );
        }
    }

    window.updateHomeCounts =
        updateHomeCounts;


    /* =========================================================
       PROFILE STATS
    ========================================================= */

    function updateProfileStats() {

        const notes =
            getJSON(
                NOTES_KEY,
                []
            );


        const schedules =
            getJSON(
                SCHEDULES_KEY,
                []
            );


        const customServices =
            getJSON(
                CUSTOM_SERVICES_KEY,
                []
            );


        const notesElements =
            document.querySelectorAll(
                "#profileNotesCount, #notesStat"
            );


        const scheduleElements =
            document.querySelectorAll(
                "#profileSchedulesCount, #schedulesStat"
            );


        const serviceElements =
            document.querySelectorAll(
                "#profileServicesCount, #servicesStat"
            );


        notesElements.forEach(
            function (element) {

                element.textContent =
                    Array.isArray(notes)
                        ? notes.length
                        : 0;

            }
        );


        scheduleElements.forEach(
            function (element) {

                element.textContent =
                    Array.isArray(schedules)
                        ? schedules.length
                        : 0;

            }
        );


        serviceElements.forEach(
            function (element) {

                element.textContent =
                    5 +
                    (
                        Array.isArray(
                            customServices
                        )
                            ? customServices.length
                            : 0
                    );

            }
        );
    }

    window.updateProfileStats =
        updateProfileStats;


    /* =========================================================
       INITIALIZE CHURCHNOTES
    ========================================================= */

    function initializeChurchNotes() {

        /*
           Inject universal CSS FIRST.
        */

        injectUniversalDarkModeCSS();


        /*
           Apply saved dark mode.
        */

        applyDarkMode();


        /*
           Load saved notification state.
        */

        loadNotificationSetting();


        /*
           Load profile.
        */

        loadHomeProfile();


        updateSettingsProfileText();


        /*
           Update Home.
        */

        updateHomeCounts();


        /*
           Update Profile stats.
        */

        updateProfileStats();


        /*
           Profile page.
        */

        if (
            document.getElementById(
                "profileInitials"
            )
        ) {

            loadProfilePage();
        }
    }


    /* =========================================================
       DOM READY
    ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeChurchNotes
        );

    } else {

        initializeChurchNotes();
    }


    /* =========================================================
       PAGE SHOW
    ========================================================= */

    window.addEventListener(
        "pageshow",
        function () {

            injectUniversalDarkModeCSS();

            applyDarkMode();

            loadNotificationSetting();

            loadHomeProfile();

            updateSettingsProfileText();

            updateHomeCounts();

            updateProfileStats();

        }
    );


    /* =========================================================
       STORAGE EVENT
    ========================================================= */

    window.addEventListener(
        "storage",
        function (event) {

            if (

                event.key ===
                    DARK_MODE_KEY ||

                event.key ===
                    NOTIFICATIONS_KEY ||

                event.key ===
                    PROFILE_KEY ||

                event.key ===
                    NOTES_KEY ||

                event.key ===
                    SCHEDULES_KEY ||

                event.key ===
                    CUSTOM_SERVICES_KEY

            ) {

                applyDarkMode();

                loadNotificationSetting();

                loadHomeProfile();

                updateSettingsProfileText();

                updateHomeCounts();

                updateProfileStats();
            }

        }
    );

})();
