function makeNotesArray() {
    return [
      {
        id: 1,
        name: 'Test note 1',
        modified: '',
        folderId: 1,
        content: 'This is test content 1'
      },
      {
        id: 2,
        name: 'Test note 2',
        modified: '',
        folderId: 2,
        content: 'This is test content 2'
      },
      {
        id: 3,
        name: 'Test note 3',
        modified: '',
        folderId: 1,
        content: 'This is test content 3'
      }
    ]
  }
  
  module.exports = {
    makeNotesArray
  }