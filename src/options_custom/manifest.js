this.manifest = {
    "name": "My Extension",
    "icon": "icon.png",
    "settings": [
        {
            "tab": 'information',
            "group": 'Featured photo categories',
            "name": 'all_categories',
            "type": 'textarea',
            "label": 'List of <a href="https://commons.wikimedia.org/wiki/Category:Featured_pictures_by_subject" target="_blank">categry titles</a>, separated by a new line ("Category:" prefix optional)'
        },
        {
            "tab": 'information',
            "group": 'Display settings',
            "name": "delay",
            "type": "text",
            "label": 'Time per slide',
            "text": 'Seconds for each slide'        
        },
        {
            'type': 'button',
            'name': 'reset',
            'tab': 'information',
            'group': 'Display settings',
            'label': '',
            'text': 'Reset to defaults'
        }
    ]
};
