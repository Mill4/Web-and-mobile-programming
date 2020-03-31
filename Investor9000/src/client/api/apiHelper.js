const authorizationHeader = () => {
    const jwtToken = localStorage.getItem('jwtToken');
    return jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
};

const commonHeaders = requireAuth => {
    const authHeader = requireAuth ? authorizationHeader() : null;
    return {
        'Content-Type': 'application/json',
        ...authHeader,
    };
};

const parseJSON = response => {
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
};

const request = (url, options) => {
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON);
};

export const get = (url, options, requireAuth) => {
    const { headers, ...rest } = options || {};
    return request(url, {
        credentials: 'include',
        method: 'GET',
        ...rest,
        headers: {
            ...commonHeaders(requireAuth),
            ...headers,
        },
    });
};

export const post = (url, options, requireAuth) => {
    const { headers, ...rest } = options || {};
    return request(url, {
        credentials: 'include',
        method: 'POST',
        ...rest,
        headers: {
            ...commonHeaders(requireAuth),
            ...headers,
        },
    });
};

export default request;
