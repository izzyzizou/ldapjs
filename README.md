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