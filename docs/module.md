# Modules

## Add Module

Module should be:

- In [modules directory](../src/modules).
- A class and its methods should have [expose decorater](../src/helpers/expose.ts)
- Exported in [index file](../src/modules/index.ts)

## Supported Modules

### Twins

- **Create**

   cmd: `twinserver.twins.create`

   payload: `'{"ip": "<yggdrasil ip>"}'`

- **Get**

   cmd: `twinserver.twins.get`

   payload: `'{"id": <twin id>}'`

- **List**

   cmd: `twinserver.twins.list`

   payload: `""`

- **Delete**

   cmd: `twinserver.twins.delete`

   payload: `'{"id": <twin id>}'`

### Contracts

- **Create Node**

   cmd: `twinserver.contracts.create_node`

   payload: `'{"node_id": "<zos node id>", "hash": "<deployment challenge hash>", "data": "<deployment data>", "public_ip": <number of public IPs>}'`

- **Create Name**

   cmd: `twinserver.contracts.create_name`

   payload: `'{"name": "<contract name>"}'`

- **Get**

   cmd: `twinserver.contracts.get`

   payload: `'{"id": <contract id>}'`

- **Update Node**

    cmd: `twinserver.contracts.update_node`

    payload: `'{"id": <contract id>, "hash": "<deployment challenge hash>", "data": "<deployment data>"}'`

- **Cancel**

   cmd: `twinserver.contracts.cancel`

   payload: `'{"id": <contract id>}'`

### ZOS

- **Deploy**

   cmd: `twinserver.zos.deploy`

   payload: the same as zos deployment without signing with additional parameter `'{"node_id": <zos node id> }'`

**Note:** `node_id` will be optional when the grid3_proxy_server is ready to be used.

### Generic Machines

- **Deploy**

    cmd: `twinserver.machines.deploy`

    payload:

```json
{
        "name": "wed1310t1",
        "network": {
            "ip_range": "10.203.0.0/16",
            "name": "wed159n3"
        },
        "machines": [{
            "name": "wed1310t2",
            "node_id": 3,
            "disks": [
                {
                    "name": "wed1310d2",
                    "size": 10,
                    "mountpoint": "/hamada"
                }
            ],
            "qsfs_disks":[
                {
                    "qsfs_zdbs_name": "hamada",
                    "name": "mon2410t2",
                    "prefix": "hamada",
                    "cache": 1, // in GB
                    "minimal_shards": 2, 
                    "expected_shards": 4,
                    "encryption_key": "hamada",
                    "mountpoint": "/ahmed",
                }
            ],
            "public_ip": false,
            "planetary": true,
            "cpu": 1,
            "memory": 1024,
            "rootfs_size": 1,
            "flist": "https://hub.grid.tf/tf-official-apps/base:latest.flist",
            "entrypoint": "/sbin/zinit init",
            "env": {
                "SSH_KEY": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDmm8OzLt+lTdGaMUwMFcw0P+vr+a/h/UsR//EzzeQsgNtC0bdls4MawVEhb3hNcycEQNd2P/+tXdLC4qcaJ6iABYip4xqqAeY098owGDYhUKYwmnMyo+NwSgpjZs8taOhMxh5XHRI+Ifr4l/GmzbqExS0KVD21PI+4sdiLspbcnVBlg9Eg9enM///zx6rSkulrca/+MnSYHboC5+y4XLYboArD/gpWy3zwIUyxX/1MjJwPeSnd5LFBIWvPGrm3cl+dAtADwTZRkt5Yuet8y5HI73Q5/NSlCdYXMtlsKBLpJu3Ar8nz1QfSQL7dB8pa7/sf/s8wO17rXqWQgZG6JzvZ root@ahmed-Inspiron-3576"
            }
        }],
        "metadata": "",
        "description": ""
    };

```

**Note:** disk size and rootfs_size in GB, memory in MB, disk name should be different than the machine name

- **List**

cmd: `twinserver.machines.list`

payload: `""`

- **Get**

cmd: `twinserver.machines.get`

payload: `{"name": "<deployment name>"}`

- **Delete**

cmd: `twinserver.machines.delete`

payload: `{"name": "<deployment name>"}`

- **Add machine**

cmd: `twinserver.machines.add_machine`

payload:

```json
{
        "deployment_name": "wed1310t1",
        "name": "wed1310m4",
        "node_id": 2,
        "disks": [
            {
                "name": "wed1310d4",
                "size": 10,
                "mountpoint": "/hamada"
            }
        ],
        "public_ip": false,
        "planetary": true,
        "cpu": 1,
        "memory": 1024,
        "rootfs_size": 1,
        "flist": "https://hub.grid.tf/tf-official-apps/base:latest.flist",
        "entrypoint": "/sbin/zinit init",
        "env": {
            "SSH_KEY": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDmm8OzLt+lTdGaMUwMFcw0P+vr+a/h/UsR//EzzeQsgNtC0bdls4MawVEhb3hNcycEQNd2P/+tXdLC4qcaJ6iABYip4xqqAeY098owGDYhUKYwmnMyo+NwSgpjZs8taOhMxh5XHRI+Ifr4l/GmzbqExS0KVD21PI+4sdiLspbcnVBlg9Eg9enM///zx6rSkulrca/+MnSYHboC5+y4XLYboArD/gpWy3zwIUyxX/1MjJwPeSnd5LFBIWvPGrm3cl+dAtADwTZRkt5Yuet8y5HI73Q5/NSlCdYXMtlsKBLpJu3Ar8nz1QfSQL7dB8pa7/sf/s8wO17rXqWQgZG6JzvZ root@ahmed-Inspiron-3576"
        }
    }
```

- **Delete machine**

cmd: `twinserver.machines.delete_machine`

payload:

```json
{
        "deployment_name": "wed1310t1",
        "name": "wed1310m2",
    }
```

### Kubernetes

single master and multiple workers.

- **Deploy**

    cmd: `twinserver.k8s.deploy`

    payload:

```json
{
        "name": "mon69t5",
        "secret": "hamadaellol",
        "network": {
                "name": "hamadanet",
                "ip_range": "10.201.0.0/16"
        },
        "masters": [
            {
                "name": "master1",
                "node_id": 3,
                "cpu": 1,
                "memory": 1024,
                "rootfs_size": 1,
                "disk_size": 15,
                "public_ip": true,
                "planetary": true
            }
        ],
        "workers": [
            {
                "name":"worker1" ,
                "node_id": 2,
                "cpu": 1,
                "memory": 1024,
                "rootfs_size": 1,
                "disk_size": 15,
                "public_ip": false,
                "planetary": true

            }
        ],
        "metadata": "",
        "description": "",
        "ssh_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDmm8OzLt+lTdGaMUwMFcw0P+vr+a/h/UsR//EzzeQsgNtC0bdls4MawVEhb3hNcycEQNd2P/+tXdLC4qcaJ6iABYip4xqqAeY098owGDYhUKYwmnMyo+NwSgpjZs8taOhMxh5XHRI+Ifr4l/GmzbqExS0KVD21PI+4sdiLspbcnVBlg9Eg9enM///zx6rSkulrca/+MnSYHboC5+y4XLYboArD/gpWy3zwIUyxX/1MjJwPeSnd5LFBIWvPGrm3cl+dAtADwTZRkt5Yuet8y5HI73Q5/NSlCdYXMtlsKBLpJu3Ar8nz1QfSQL7dB8pa7/sf/s8wO17rXqWQgZG6JzvZ root@ahmed-Inspiron-3576"
    }
```

**Note:** disk size and rootfs_size in GB, memory in MB, masters and workers names should be different

- **List**

cmd: `twinserver.k8s.list`

payload: `""`

- **Get**

cmd: `twinserver.k8s.get`

payload: `{"name": "<deployment name>"}`

- **Delete**

cmd: `twinserver.k8s.delete`

payload: `{"name": "<deployment name>"}`

- **Add worker**

cmd: `twinserver.k8s.add_worker`

payload:

```json
{
        "deployment_name": "sun199t2",
        "name": "sun199t1worker5",
        "node_id": 5,
        "cpu": 2,
        "memory": 1024,
        "rootfs_size": 1,
        "disk_size": 15,
        "public_ip": false,
        "planetary": true
        
    }
```

- **Delete worker**

cmd: `twinserver.k8s.delete_worker`

payload:

```json
{
        "deployment_name": "sun199t2",
        "name": "sun199t1worker5",
    }
```

### zdb

- **Deploy**

    cmd: `twinserver.zdbs.deploy`

    payload:

```json
{
        "name": "hamada",
        "zdbs": [{
            "name": "zdb1",
            "node_id": 3,
            "mode": "seq",
            "disk_size": 10,
            "public": true,
            "password": "hamadaellol",
        }, {
            "name": "zdb2",
            "node_id": 3,
            "mode": "seq",
            "disk_size": 10,
            "public": true,
            "password": "hamadaellol",
        }],
        "metadata": "",
        "description": ""
    }
```

**Note:** disk size in GB, zdb names should be different

- **List**

cmd: `twinserver.zdbs.list`

payload: `""`

- **Get**

cmd: `twinserver.zdbs.get`

payload: `{"name": "<deployment name>"}`

- **Delete**

cmd: `twinserver.zdbs.delete`

payload: `{"name": "<deployment name>"}`

- **Add zdb**

cmd: `twinserver.zdbs.add_zdb`

payload:

```json
{
        "deployment_name": "sun199t1",
        "name": "hamada1",
        "node_id": 2,
        "mode": "seq",
        "disk_size": 10,
        "public": true,
        "password": "hamada12345",

    }
```

- **Delete zdb**

cmd: `twinserver.zdbs.delete_zdb`

payload:

```json
{
        "deployment_name": "sun199t1",
        "name": "hamada1",
    }
```

### QSFS Zdbs

- **Deploy**

    cmd: `twinserver.qsfs_zdbs.deploy`

    payload:

```json
{
        "name": "hamada",
        "count": 3,
        "node_ids": [3, 5],
        "disk_size": 10,
        "password": "hamadaellol",
        "metadata": "",
        "description": ""
    }
```

**Note:** disk size in GB

- **List**

cmd: `twinserver.qsfs_zdbs.list`

payload: `""`

- **Get**

cmd: `twinserver.qsfs_zdbs.get`

payload: `{"name": "<deployment name>"}`

- **Delete**

cmd: `twinserver.qsfs_zdbs.delete`

payload: `{"name": "<deployment name>"}`

### Stellar

- **Import**
It will return the wallet address after importing the wallet and saving it.

cmd: `twinserver.stellar.import`

payload:

```json
{
    "name": "mywallet",
    "secret": "<wallet secret>",
}
```

- **Get**
It will return the wallet address.

cmd: `twinserver.stellar.get`

payload: `{"name": "<wallet name>"}`

- **Update**
It will return the new wallet address after updating the wallet and saving it.

cmd: `twinserver.stellar.update`

payload:

```json
{
    "name": "mywallet",
    "secret": "<wallet secret>",
}
```

- **Exists**

cmd: `twinserver.stellar.exists`

payload: `{"name": "<wallet name>"}`

- **List**

cmd: `twinserver.stellar.list`

payload: `""`

- **Balance by name**

cmd: `twinserver.stellar.balance_by_name`

payload: `{"name": "<wallet name>"}`

- **Balance by address**

cmd: `twinserver.stellar.balance_by_address`

payload: `{"address": "<wallet name>"}`

- **Transfer**

cmd: `twinserver.stellar.transfer`

payload:

```json
{
    "name": "<wallet name>",
    "target_address": "<target wallet address>",
    "amount": 10,
    "asset": "TFT",
    "memo": "try1",
}
```

- **Delete**

cmd: `twinserver.stellar.delete`

payload: `{"name": "<wallet name>"}`
