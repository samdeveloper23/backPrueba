const pruebas = async (req, res, next) => {
    const { email } = req.body;
    try {

        res.send({
            status: 'ok',
            message: 'Equipo de SocialDoby, este servidor ya desplegado funciona y de modo de prueba teneis esta linea emitida, gracias en confiar y pronto podremos seguir estudiando más y mejor si todos colaboramos',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = pruebas;
