              o=example
              /       \
         ou=users     ou=groups
        /      |         |     \
    cn=john  cn=jane    cn=dudes  cn=dudettes
    /
keyid=foo

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