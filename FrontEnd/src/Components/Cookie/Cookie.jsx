import { jwtDecode } from 'jwt-decode';

// Setting a JWT token
function setCookie(name, value, hours) {
    let expires = "";
    if (name === 'token') {
        const decoded = jwtDecode(value);
        const date = new Date();
        date.setTime(date.getTime() + (decoded.exp * 1000));
        expires = "; expires=" + date.toUTCString();
    } else if (hours) {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function updateCookie(name, value) {
    const decoded = jwtDecode(value);
    // Get the expiry time of the token
    const date = new Date();
    date.setTime(date.getTime() + (decoded.exp * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Getting the JWT token
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Deleting the JWT token
function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// Check cookie expiry
function checkCookieExpiry(name) {
    const cookie = getCookie(name);
    if (cookie) {
        const decoded = jwtDecode(cookie);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            deleteCookie(name);
            return true;
        } else {
            return false
        }
    } else {
        return null;
    }
}

export { setCookie, getCookie, deleteCookie, checkCookieExpiry, updateCookie };