//module
var ldap = require('ldapjs');
var ldapClient = require('ldap-client');
// bindings
/*var ldapsearch = new LDAP({
    uri:             'ldap://server',   // string
    validatecert:    false,             // Verify server certificate
    connecttimeout:  -1,                // seconds, default is -1 (infinite timeout), connect timeout
    base:            'dc=com',          // default base for all future searches
    attrs:           '*',               // default attribute list for future searches
    filter:          '(objectClass=*)', // default filter for all future searches
    scope:           LDAP.SUBTREE,      // default scope for all future searches
    connect:         function(),        // optional function to call when connect/reconnect occurs
    disconnect:      function(),        // optional function to call when disconnect occurs        
}, function(err) {
    // connected and ready    
});*/


var client = ldap.createClient({
    url: "ldap://server:389"
});

var opts = {
    filter: '($(l=Seattle)(email=*@foo.com))',
    scope: 'sub',
    attributes: ['dn', 'sn', 'cn']
};

client.search('o=example', opts, function(err, res){
    assert.ifError(err);

    res.on('searchEntry', function(entry){
        console.log('entry: ' + JSON.stringify(entry.object));
    });
    res.on('searchReference', function(referral){
        console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err){
        console.error('error: ' + err.message);
    });
    res.on('end', function(result){
        console.log('status: ' + result.status);
    });
});

server.listen(1389, function(){
    console.log('/etc/passwd LDAP server up at: %s', client.url);
});