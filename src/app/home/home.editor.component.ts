import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'content-editor',
    styleUrls: ['./home.editor.component.scss'],
    templateUrl: './home.editor.component.html'
})
export class ContentEditorComponent implements OnInit {
    @Output() public onEditorBlur = new EventEmitter();
    @Output() public onMarkBlur = new EventEmitter();
    @Output() public onEditorChange = new EventEmitter();
    @Input() public editorContent = '';
    @Input() public editorHeight = 300;
    @Input() public markContent = '';
    @Input() public editorType = 'ckeditor';
    public editorConfig: any;
    public ngOnInit() {
        this.editorConfig = {
            toolbar: [
                { name: 'document', items: ['Source'] },
                { name: 'basicstyles', items: ['Bold', 'Italic'] },
                {
                    name: 'paragraph',
                    items: [
                        'NumberedList',
                        'BulletedList',
                        '-',
                        'Outdent',
                        'Indent',
                        '-',
                        'Blockquote']
                },
                { name: 'links', items: ['Link', 'Unlink'] },
                { name: 'insert', items: ['CodeSnippet', 'Image'] },
            ],
            height: this.editorHeight + 'px',
            extraPlugins: 'codesnippet',
            removePlugins: 'image',
            codeSnippet_theme: 'ir_black',
            format_tags: 'p;h1;h2;h3;pre',
            removeDialogTabs: 'image:advanced;link:advanced;link:target',
        };
    }
    public editorBlur(event) {
        this.onEditorBlur.emit(
            {
                content: event.editor ? event.editor.getData() : event.target.value,
                height: event.editor ?
                (event.editor.container.$.scrollHeight - 71) :
                event.target.scrollHeight
            }
        );
    }
    public markBlur() {
        this.onMarkBlur.emit(this.markContent);
    }
    public onChange() {
        this.onEditorChange.emit(this.markContent);
    }
}
