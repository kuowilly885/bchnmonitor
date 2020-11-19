module.exports = async (context, req, connectionInfo) => {
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: connectionInfo
    }
}
