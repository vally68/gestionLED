export function validateForm(nom, prenom, email, password) {
    const validateName = (name) => {
        if (name.length <= 0) {
            return 'Veuillez entrer un nom';
        }
        return '';
    };

    const validatePrenom = (prenom) => {
        if (prenom.length <= 0) {
            return 'Veuillez entrer un prénom';
        }
        return '';
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            return 'Adresse Mail invalide.';
        }
        return '';
    };

    const validatePassword = (password) => {
        if (password.length <= 0) {
            return 'Mot de passe invalide.';
        }
        return '';
    };

    const nomError = validateName(nom);
    const prenomError = validatePrenom(prenom);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    return { nomError,prenomError, emailError, passwordError };
}

export function validateLoginForm(email, password) {


    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            return "Adresse Mail invalide.";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (password.length <= 0) {
            return "Mot de passe invalide.";
        }
        return "";
    };



    {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        return { emailError, passwordError };
    }


}
