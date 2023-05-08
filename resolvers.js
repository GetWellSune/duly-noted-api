import cuid from "cuid"

const savedNotes = [];



export default {
    Mutation: {
        createNote(_, args) {
            const { note } = args

            const newNote = { ...note };

            if (!newNote.id) {
                newNote.id = cuid();
            }

            if (!newNote.createdAt) {
                const now = new Date();
                newNote.createdAt = now.toISOString();
            }

            if (!newNote.updatedAt) {
                const now = new Date();
                newNote.updatedAt = now.toISOString();
            }

            if (typeof newNote.isArchived !== "boolean") {
                newNote.isArchived = false;
            }

            savedNotes.push(newNote);

            return newNote;
        },
        updateNote(_, args) {

            const { note } = args

            const newNote = { ...note };

            let updated = false;

            if (savedNotes.find((note) => note.id === args.id) == null) {
                throw new Error('There is no note with this id');
            }

            if (!newNote.id) {
                newNote.id = cuid();
            }

            if (!newNote.createdAt) {
                const now = new Date();
                newNote.createdAt = now.toISOString();
            }

            if (note.isArchived === false) {
                newNote.isArchived = false;
            } else {
                newNote.isArchived = true;
                updated = true;
            }

            if (typeof note.text === "string") {
                newNote.text = note.text;
                updated = true;
            }

            if (updated === true) {
                const now = new Date();
                newNote.updatedAt = now.toISOString();
            }

            const objIndex = savedNotes.findIndex(note => note.id === note.args)

            savedNotes.splice(objIndex, 1, newNote)

            return newNote;
        },
        deleteNote(_, args) {
            const { note } = args

            const fullnote = savedNotes.find((note) => note.id === args.id);

            const newNote = { ...fullnote };

            if (typeof newNote.isArchived !== "boolean") {
                newNote.isArchived = false;
            }

            if (savedNotes.find((note) => note.id === args.id) == null) {
                throw new Error('There is no note with this id');
            }

            const objIndex = savedNotes.findIndex(note => note.id === note.args)

            savedNotes.splice(objIndex, 1)

            return newNote;
        }
    },

    Query: {
        note(_, args) {
            return savedNotes.find((note) => note.id === args.id);
        },

        notes(_, args) {
            if (args.includeArchived === false || args.includeArchived === null) {
                const filteredNotes = savedNotes.filter((note) => note.isArchived === false).map((filteredNote) => {
                    if (filteredNote.isArchived === false) {
                        return {
                            ...filteredNote
                        }
                    } return filteredNote;
                })
                return filteredNotes;
            } else {
                return savedNotes;
            }
        }
    }
};