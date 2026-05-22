const { execSync } = require('child_process');
try {
    const output = execSync('git status', { encoding: 'utf-8', cwd: '..' });
    console.log(output);
} catch (err) {
    console.error('Git status error:', err.message);
    if (err.stdout) console.log('Stdout:', err.stdout);
    if (err.stderr) console.error('Stderr:', err.stderr);
}
