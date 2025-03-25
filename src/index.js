document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const characterBar = document.getElementById('character-bar');
    const nameDisplay = document.getElementById('name');
    const imageDisplay = document.getElementById('image');
    const voteCountDisplay = document.getElementById('vote-count');
    const votesForm = document.getElementById('votes-form');
    const votesInput = document.getElementById('votes');
    const resetBtn = document.getElementById('reset-btn');

    const characterForm = document.getElementById('character-form');
  
    const baseURL = "http://localhost:3000";
    let currentCharacter = null; // The character currently displayed in the detailed section
  
    // Fetch and display all characters in the character bar
    fetch(`${baseURL}/characters`)
      .then(response => response.json())
      .then(characters => {
        characters.forEach(character => renderCharacter(character));
      })
      .catch(error => console.error('Error fetching characters:', error));
  

    function renderCharacter(character) {
      const span = document.createElement('span');
      span.textContent = character.name;
      span.dataset.id = character.id;
      span.style.cursor = "pointer";
      span.addEventListener('click', () => {
        // Display character details when clicked
        currentCharacter = character;
        displayCharacter(character);
      });
      characterBar.appendChild(span);
    }
  
    // Display the selected character’s details 
    function displayCharacter(character) {
      nameDisplay.textContent = character.name;
      imageDisplay.src = character.image;
      imageDisplay.alt = character.name;
      voteCountDisplay.textContent = character.votes;
    }
  
    // Handle votes form submission to add votes
    votesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentCharacter) return; // Exit if no character has been selected
  
      // Parse the additional votes from the input field (defaulting to 0 if empty)
      const additionalVotes = parseInt(votesInput.value) || 0;
      currentCharacter.votes += additionalVotes;
      voteCountDisplay.textContent = currentCharacter.votes;
      votesInput.value = '';
  
 
      fetch(`${baseURL}/characters/${currentCharacter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ votes: currentCharacter.votes })
      })
        .then(response => response.json())
        .then(updatedCharacter => {
          console.log('Votes updated:', updatedCharacter);
        })
        .catch(error => console.error('Error updating votes:', error));
    });
  

    resetBtn.addEventListener('click', () => {
      if (!currentCharacter) return;
      currentCharacter.votes = 0;
      voteCountDisplay.textContent = 0;

      fetch(`${baseURL}/characters/${currentCharacter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ votes: 0 })
      })
        .then(response => response.json())
        .then(updatedCharacter => {
          console.log('Votes reset:', updatedCharacter);
        })
        .catch(error => console.error('Error resetting votes:', error));
    });
  

    if (characterForm) {

      const characterNameInput = document.getElementById('character-name') || characterForm.querySelector('[name="name"]');
      const imageUrlInput = document.getElementById('character-image-url') || characterForm.querySelector('[name="image-url"]');
  
      characterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = characterNameInput.value.trim();
        const newImage = imageUrlInput.value.trim();
  
        if (!newName || !newImage) return;
  
        const newCharacter = {
          name: newName,
          image: newImage,
          votes: 0
        };
  
        // Extra Bonus: Save new character to the server using a POST request
        fetch(`${baseURL}/characters`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newCharacter)
        })
          .then(response => response.json())
          .then(addedCharacter => {
            // Render the new character in the character bar
            renderCharacter(addedCharacter);
            // Immediately display the new character’s details
            currentCharacter = addedCharacter;
            displayCharacter(addedCharacter);
            // Clear the form fields
            characterForm.reset();
          })
          .catch(error => console.error('Error adding new character:', error));
      });
    }
  });
