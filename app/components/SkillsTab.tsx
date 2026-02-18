'use client';

import { useState } from 'react';
import { Wrench, Plus, Edit, Trash2, PlayCircle, FileText, Code } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
  files: string[];
  location: string;
}

interface SkillFile {
  name: string;
  content: string;
}

const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'healthcheck',
    description: 'Host security hardening and risk-tolerance configuration',
    files: ['SKILL.md', 'scripts/audit.sh'],
    location: '/opt/openclaw/app/skills/healthcheck',
  },
  {
    id: '2',
    name: 'weather',
    description: 'Get current weather and forecasts (no API key required)',
    files: ['SKILL.md'],
    location: '/opt/openclaw/app/skills/weather',
  },
  {
    id: '3',
    name: 'skill-creator',
    description: 'Create or update AgentSkills with scripts and assets',
    files: ['SKILL.md', 'templates/SKILL.template.md'],
    location: '/opt/openclaw/app/skills/skill-creator',
  },
];

export default function SkillsTab() {
  const [skills] = useState<Skill[]>(mockSkills);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillFiles, setSkillFiles] = useState<SkillFile[]>([
    { name: 'SKILL.md', content: '# Skill Name\n\n## Description\n\nWhat this skill does.\n\n## Usage\n\nHow to use it.' }
  ]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedSkill(null);
    setSkillName('');
    setSkillDescription('');
    setSkillFiles([
      { name: 'SKILL.md', content: '# Skill Name\n\n## Description\n\nWhat this skill does.\n\n## Usage\n\nHow to use it.' }
    ]);
  };

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsEditing(true);
    setIsCreating(false);
    setSkillName(skill.name);
    setSkillDescription(skill.description);
    // In real implementation, would fetch actual file contents
    setSkillFiles([
      { name: 'SKILL.md', content: `# ${skill.name}\n\n${skill.description}` }
    ]);
  };

  const handleSave = () => {
    // In real implementation, would save to filesystem via API
    console.log('Saving skill:', { skillName, skillDescription, skillFiles });
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedSkill(null);
  };

  const addFile = () => {
    const fileName = prompt('Enter file name (e.g., script.sh, config.json):');
    if (fileName) {
      setSkillFiles([...skillFiles, { name: fileName, content: '' }]);
    }
  };

  const removeFile = (index: number) => {
    setSkillFiles(skillFiles.filter((_, i) => i !== index));
  };

  const updateFileContent = (index: number, content: string) => {
    const updated = [...skillFiles];
    updated[index].content = content;
    setSkillFiles(updated);
  };

  return (
    <div>
      {!isCreating && !isEditing ? (
        // Skills Grid View
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Skills</h2>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-openclaw-orange hover:bg-openclaw-orange/80 rounded-lg font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Skill
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-openclaw-orange/10 rounded-lg">
                    <Wrench className="h-5 w-5 text-openclaw-orange" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{skill.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <FileText className="h-3 w-3" />
                  <span>{skill.files.length} file{skill.files.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    <PlayCircle className="h-3 w-3" />
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Create/Edit Form
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {isCreating ? 'Create New Skill' : `Edit: ${selectedSkill?.name}`}
            </h2>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Skill Name</label>
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="my-awesome-skill"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Description</label>
              <textarea
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                placeholder="What does this skill do?"
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-openclaw-orange"
              />
            </div>

            {/* Files */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-400">Files</label>
                <button
                  onClick={addFile}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Add File
                </button>
              </div>

              <div className="space-y-4">
                {skillFiles.map((file, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-sm">{file.name}</span>
                      </div>
                      {file.name !== 'SKILL.md' && (
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                    </div>
                    <textarea
                      value={file.content}
                      onChange={(e) => updateFileContent(index, e.target.value)}
                      rows={10}
                      className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-openclaw-orange"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-openclaw-orange hover:bg-openclaw-orange/80 rounded-lg font-medium transition-colors"
              >
                Save Skill
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
