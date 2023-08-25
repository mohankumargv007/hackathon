// ApiKeyComponent.js

const ApiKeyComponent = () => {
    // Access the environment variable
    const apiKey = process.env.ENV_NAME;

    return (
        <div>
            <p>API Key: {apiKey}</p>
        </div>
    );
};

export default ApiKeyComponent;