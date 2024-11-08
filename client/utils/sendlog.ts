export const sendLog = async (message: string, type: 'info' | 'error' | 'warning', from: string, origin: string) => {
    const logData = {
        message,
        date: new Date().toISOString(),
        from,
        origin,
    };

    try {
        await fetch(`http://localhost:3000/api/logger/write${type}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(logData),
        });
    } catch (error) {
        console.error("Error al enviar el log:", error);
    }
};
