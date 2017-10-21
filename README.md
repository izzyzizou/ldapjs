```             
              o=example
              /       \
         ou=users     ou=groups
        /      |         |     \
    cn=john  cn=jane    cn=dudes  cn=dudettes
    /
keyid=foo
```
LDAP is theh "Lightweight Directory Access Protocol"

Sample: 
dn: cn=john, ou=users, o=example
cn: john
sn: smith
email: john@example.com
email: john.smith@example.com
objectClass: person

To get Started with LDAPJS, download the npm module:
```
npm install ldapjs
```

A few things to note:

---
All names in a directory tree are actually referred to as a distinguished name, or dn for short. A dn is comprised of attributes that lead to that node in the tree, as shown above (the syntax is foo=bar, ...).
---
The root of the tree is at the right of the dn, which is inverted from a filesystem hierarchy.
---
Every entry in the tree is an instance of an objectclass.
---
An objectclass is a schema concept; think of it like a table in a traditional ORM.
---
An objectclass defines what attributes an entry can have (on the ORM analogy, an attribute would be like a column).
---

Common patterns

The last two parameters in every API are controls and callback. controls can be either a single instance of a Control or an array of Control objects. You can, and probably will, omit this option.

Almost every operation has the callback form of function(err, res) where err will be an instance of an LDAPError (you can use instanceof to switch). You probably won't need to check the res parameter, but it's there if you do.

bind

bind(dn, password, controls, callback)

Performs a bind operation against the LDAP server.

The bind API only allows LDAP 'simple' binds (equivalent to HTTP Basic Authentication) for now. Note that all client APIs can optionally take an array of Control objects. You probably don't need them though...

Example:

```javascript
client.bind('cn=root', 'secret', function(err) {
    assert.ifError(err);
});
```

search
```javascript
search(base, options, controls, callback)
```
Performs a search operation against the LDAP server.

The search operation is more complex than the other operations, so this one takes an options object for all the parameters. However, ldapjs makes some defaults for you so that if you pass nothing in, it's pretty much equivalent to an HTTP GET operation (i.e., base search against the DN, filter set to always match).

Like every other operation, base is a DN string.

Options can be a string representing a valid LDAP filter or an object containing the following fields:

Attribute	Description
scope	One of base, one, or sub. Defaults to base.
filter	A string version of an LDAP filter (see below), or a programatically constructed Filter object. Defaults to (objectclass=*).
attributes	attributes to select and return (if these are set, the server will return only these attributes). Defaults to the empty set, which means all attributes. You can provide a string if you want a single attribute or an array of string for one or many.
attrsOnly	boolean on whether you want the server to only return the names of the attributes, and not their values. Borderline useless. Defaults to false.
sizeLimit	the maximum number of entries to return. Defaults to 0 (unlimited).
timeLimit	the maximum amount of time the server should take in responding, in seconds. Defaults to 10. Lots of servers will ignore this.
paged	enable and/or configure automatic result paging
Responses from the search method are an EventEmitter where you will get a notification for each searchEntry that comes back from the server. You will additionally be able to listen for a searchReference, error and end event. Note that the error event will only be for client/TCP errors, not LDAP error codes like the other APIs. You'll want to check the LDAP status code (likely for 0) on the end event to assert success. LDAP search results can give you a lot of status codes, such as time or size exceeded, busy, inappropriate matching, etc., which is why this method doesn't try to wrap up the code matching.

Example:
```javascript
var opts = {
  filter: '(&(l=Seattle)(email=*@foo.com))',
  scope: 'sub',
  attributes: ['dn', 'sn', 'cn']
};

client.search('o=example', opts, function(err, res) {
  assert.ifError(err);

  res.on('searchEntry', function(entry) {
    console.log('entry: ' + JSON.stringify(entry.object));
  });
  res.on('searchReference', function(referral) {
    console.log('referral: ' + referral.uris.join());
  });
  res.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  res.on('end', function(result) {
    console.log('status: ' + result.status);
  });
});
```

Using LDAP CLIENT:

```javascript
var LDAP = require('ldap-client');
LDAP.BASE = 0;
LDAP.ONELEVEL = 1;
LDAP.SUBTREE = 2;
LDAP.SUBORDINATE = 3;
LDAP.DEFAULT = -1;
var search_options = {
  base: 'dc=com',
  scope: LDAP.SUBTREE,
  filter: '(objectClass=*)',
  attrs: '*'
}
ldap.search(search_options, function(err, data));
```
List of attributes you want is passed as simple string - join their names with space if you need more ('objectGUID sAMAccountName cname' is example of valid attrs filter). '*' is also accepted.

Results are returned as an array of zero or more objects. Each object has attributes named after the LDAP attributes in the found record(s). Each attribute contains an array of values for that attribute (even if the attribute is single-valued - having to check typeof() before you can act on /anything/ is a pet peeve of mine). The exception to this rule is the 'dn' attribute - this is always a single-valued string.

Example of search result:
```javascript
[ { gidNumber: [ '2000' ],
  objectClass: [ 'posixAccount', 'top', 'account' ],
  uidNumber: [ '3214' ],
  uid: [ 'fred' ],
  homeDirectory: [ '/home/fred' ],
  cn: [ 'fred' ],
  dn: 'cn=fred,dc=ssimicro,dc=com' } ]
  ```