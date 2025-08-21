# Rescue MD Notebook

😊

## Configuration files
- global config (gconfig)
  - current root directory
  - color mode
  - language
- root config (rconfig)
  - filetree
    - treedata
    - opened node

## Tauri backend commands
Those commands must be inspired by sequences.  
WIP

## Sequence examples
### Startup
```mermaid
sequenceDiagram
    actor user
    participant front
    participant back
    participant filesystem
    front->>back: get all gconfig
    back->>filesystem: open gconfig
    alt is gconfig exists
        filesystem->>back: current gconfig
        back->>front: current gconfig
        front->>back: get rconfig
        back->>filesystem: open rconfig
        alt is rconfig exists
            filesystem->>back: current rconfig
        else
            back->>filesystem: read directory structure
            alt is read succeeded
                back->>back: create rconfig
                back->>filesystem: write rconfig
                back->>front: current rconfig
                front->>front: create treeview
            else
                back->>front: read root failed
                front->>user: permission failed
            end
        end
    else
        back->>filesystem: create default gconfig
        back->>front: no gconfig
        front->>user: request root path
    end
```

### Update root path
```mermaid
sequenceDiagram
    actor user
    participant front
    participant back
    participant filesystem
    user->>front: update root path
    front->>back: [cmd]set gconfig by key
    back->>filesystem: open gconfig
    filesystem->>back: current gconfig
    back->>back: replace gconfig by key
    back->>filesystem: write new gconfig
    back->>front: set result
    front->>user: update result
```

### Filetree changed
```mermaid
sequenceDiagram
    actor user
    participant front
    participant back
    participant filesystem
    user->>front: change file treeview
    front->>front: create new treedata and rconfig
    front->>back: new rconfig
    alt is structure changed
        front->>back: changed structure
        back->>filesystem: move files
        back->>filesystem: write new rconfig
        alt is move&write succeeded
            back->>front: change succeeded
            front->>user: change succeeded
        else
            back->>front: prev rconfig
            front->>front: rollback treedata
            front->>user: change failed
        end
    else
        back->>filesystem: write new rconfig
        alt is write succeeded
            back->>front: change succeeded
            front->>user: change succeeded
        else
            back->>front: prev rconfig
            front->>front: rollback treedata
            front->>user: change failed
        end
    end
```