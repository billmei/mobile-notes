$('.no-js').remove();

$(document).ready(function() {

  var NoteModel = Backbone.Model.extend({
    defaults: {
      markdown: '',
      rendered_html: ''
    }
  });

  var NoteCollection = Backbone.Collection.extend({
    model: NoteModel,
    localStorage: new Backbone.LocalStorage('notes-manager'),
  });

  var NoteView = Backbone.View.extend({
    tagName: 'div',
    className: 'panel panel-default',

    events: {
      'click .remove-note' : 'remove',
      'focus .note-input' : 'edit',
      'click .panel-body' : 'edit',
      'click .cancel-note' : 'cancel',
      'click .save-note' : 'close'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'unrender', 'remove', 'edit', 'cancel');

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
    },

    render: function() {
      this.$el.html(
        '<div class="panel-body">' +
          '<textarea class="note-input expanding">' + this.model.get('markdown') + '</textarea>'+
          '<div class="note-output">' + this.model.get('rendered_html') + '</div>' +
        '</div><div class="panel-footer">'+
          '<div class="buttons-inline"><button class="btn btn-danger remove-note"><i class="fa fa-trash"></i> Remove</button></div>' +
          '<div class="buttons-inline"><button class="btn btn-primary cancel-note"><i class="fa fa-times"></i> Cancel</button></div>' +
          '<div class="buttons-inline"><button class="btn btn-success save-note"><i class="fa fa-check"></i> Save</button></div>' +
        '</div>'
      );
      return this;
    },

    unrender: function() {
      this.$el.remove();
    },

    edit: function() {
      var textarea = this.$('.note-input');
      var oldVal = textarea.val();

      textarea.expanding();
      this.$el.addClass('editing');
      if (textarea[0] !== document.activeElement) {
        textarea.focus().val('').val(oldVal);
      }
    },

    cancel: function() {
      // Close without saving
      if (!this.model.get('rendered_html')) {
        this.remove();
      } else {
        this.$('.note-input').val(this.model.get('markdown')).change();
        this.$el.removeClass('editing');
      }
    },

    close: function() {
      // Save on exit
      var markdown = this.$('.note-input').val();
      if (!markdown) {
        this.remove();
      } else {
        this.$el.removeClass('editing');
        this.model.save({
          'markdown' : markdown,
          'rendered_html' : marked(markdown)
        });
      }
    },

    remove: function() {
      this.model.destroy();
    }
  });

  var ListView = Backbone.View.extend({
    el: $('#notes-area'),
    events: {
      'click #add-note' : 'addNote',
    },

    initialize: function() {
      _.bindAll(this, 'render', 'addNote', 'appendNote');

      this.collection = new NoteCollection();
      this.collection.fetch();
      if (this.collection.length === 0) {
        // Defaults if there are no notes
        var welcome1 = '# Notes for Mobile\n**[Fork this project on GitHub](https://github.com/Kortaggio/mobile-notes)**!' +
          '\n\n**Edit any note (including this one!) by tapping on it.** ' +
          'Add new notes with the "Add Note" button below. Notes persist in local storage so your notes will be saved here as long as you don\'t clear your cache.';
        var welcome2 = '## Markdown Support\nNotes support [markdown](https://help.github.com/articles/markdown-basics/), which means you can do **bold**, *italics*, and even fancy stuff like:\n'+
          '\n- Make a list for to-dos' +
          '\n- ~~Check off stuff you\'ve completed~~' +
          '\n- `inline code`' +
          '\n- etc.' ;
        var note1 = new NoteModel();
        var note2 = new NoteModel();
        this.collection.create(note1);
        note1.save({
          'markdown' : welcome1,
          'rendered_html' : marked(welcome1)
        });
        this.collection.create(note2);
        note2.save({
          'markdown' : welcome2,
          'rendered_html' : marked(welcome2)
        });
      }

      this.collection.bind('add', this.appendNote);
      this.render();
    },

    render: function() {
      var self = this;
      this.$el.append('<div id="note-list"></div>');
      this.$el.append('<button id="add-note" class="btn btn-primary"><i class="fa fa-plus"></i> Add Note</button>');
      _(this.collection.models).each(function(note){
        self.appendNote(note);
      }, this);
    },

    addNote: function() {
      this.collection.create(new NoteModel());
    },

    appendNote: function(note) {
      var noteView = new NoteView({
        model: note
      });
      var noteEl = noteView.render().$el;
      $('#note-list', this.el).append(noteEl);
      if (!noteEl.children().children('.note-input').val()) {
        noteEl.addClass('editing');
      }
    }
  });

  var listView = new ListView();

});
