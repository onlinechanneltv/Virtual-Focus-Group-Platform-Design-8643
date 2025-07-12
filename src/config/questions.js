export const participantQuestions = {
  demographics: [
    { id: 'age', type: 'number', label: 'Age', required: true },
    { id: 'dob', type: 'date', label: 'Date of Birth', required: true },
    { id: 'gender', type: 'select', label: 'Gender', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'], required: true },
    { id: 'ethnicity', type: 'select', label: 'Ethnicity', options: ['White', 'Black/African American', 'Hispanic/Latino', 'Asian', 'Native American', 'Pacific Islander', 'Mixed Race', 'Other'], required: false },
    { id: 'location_country', type: 'text', label: 'Country', required: true },
    { id: 'location_state', type: 'text', label: 'State/Province', required: true },
    { id: 'location_city', type: 'text', label: 'City', required: true },
    { id: 'education', type: 'select', label: 'Education Level', options: ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Trade School', 'Other'], required: false },
    { id: 'occupation', type: 'text', label: 'Occupation', required: false },
    { id: 'income', type: 'select', label: 'Annual Income', options: ['Under $25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '$100k-$150k', 'Over $150k', 'Prefer not to say'], required: false },
    { id: 'marital_status', type: 'select', label: 'Marital Status', options: ['Single', 'Married', 'Divorced', 'Widowed', 'In a relationship'], required: false },
    { id: 'children', type: 'select', label: 'Do you have children?', options: ['Yes', 'No'], required: false },
    { id: 'household_size', type: 'number', label: 'Household Size', required: false }
  ],
  beliefs: [
    { id: 'political_affiliation', type: 'select', label: 'Political Affiliation', options: ['Very Liberal', 'Liberal', 'Moderate', 'Conservative', 'Very Conservative', 'Independent', 'Prefer not to say'], required: false },
    { id: 'religion', type: 'select', label: 'Religious Affiliation', options: ['Christianity', 'Islam', 'Judaism', 'Hinduism', 'Buddhism', 'Atheist', 'Agnostic', 'Other', 'Prefer not to say'], required: false },
    { id: 'environmental_concern', type: 'scale', label: 'How concerned are you about environmental issues?', min: 1, max: 5, required: false },
    { id: 'social_causes', type: 'multiselect', label: 'Which social causes do you support?', options: ['LGBTQ+ Rights', 'Racial Equality', 'Gender Equality', 'Animal Rights', 'Climate Change', 'Poverty Reduction', 'Education Reform', 'Healthcare Access'], required: false },
    { id: 'brand_loyalty', type: 'scale', label: 'How important is brand loyalty to you?', min: 1, max: 5, required: false }
  ],
  lifestyle: [
    { id: 'hobbies', type: 'multiselect', label: 'Hobbies & Interests', options: ['Reading', 'Gaming', 'Sports', 'Music', 'Art', 'Cooking', 'Travel', 'Photography', 'Fitness', 'Gardening', 'Technology', 'Fashion', 'DIY/Crafts', 'Outdoor Activities'], required: false },
    { id: 'exercise_frequency', type: 'select', label: 'Exercise Frequency', options: ['Daily', '3-4 times/week', '1-2 times/week', 'Rarely', 'Never'], required: false },
    { id: 'diet_type', type: 'select', label: 'Diet Type', options: ['No restrictions', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-free', 'Other dietary restrictions'], required: false },
    { id: 'shopping_frequency', type: 'select', label: 'Shopping Frequency', options: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Rarely'], required: false },
    { id: 'shopping_preference', type: 'select', label: 'Shopping Preference', options: ['Online only', 'In-store only', 'Mix of both', 'Depends on item'], required: false },
    { id: 'social_media_usage', type: 'scale', label: 'Social Media Usage (hours/day)', min: 0, max: 12, required: false },
    { id: 'tech_adoption', type: 'select', label: 'Technology Adoption', options: ['Early adopter', 'Early majority', 'Late majority', 'Laggard'], required: false },
    { id: 'risk_tolerance', type: 'scale', label: 'Risk Tolerance', min: 1, max: 5, required: false },
    { id: 'spending_habits', type: 'select', label: 'Spending Habits', options: ['Very frugal', 'Budget conscious', 'Moderate spender', 'Free spender', 'Impulse buyer'], required: false }
  ],
  media_preferences: [
    { id: 'favorite_genres', type: 'multiselect', label: 'Favorite Movie/TV Genres', options: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Documentary', 'Animation', 'Thriller', 'Fantasy', 'Mystery', 'Western'], required: false },
    { id: 'streaming_services', type: 'multiselect', label: 'Streaming Services Used', options: ['Netflix', 'Amazon Prime', 'Disney+', 'Hulu', 'HBO Max', 'Apple TV+', 'Paramount+', 'YouTube Premium', 'Other'], required: false },
    { id: 'content_consumption', type: 'select', label: 'Primary Content Consumption Time', options: ['Morning', 'Afternoon', 'Evening', 'Late night', 'Varies'], required: false },
    { id: 'device_preference', type: 'multiselect', label: 'Preferred Viewing Devices', options: ['TV', 'Laptop', 'Tablet', 'Smartphone', 'Desktop'], required: false },
    { id: 'music_genres', type: 'multiselect', label: 'Favorite Music Genres', options: ['Pop', 'Rock', 'Hip-Hop', 'Country', 'Electronic', 'Classical', 'Jazz', 'R&B', 'Indie', 'Folk'], required: false },
    { id: 'news_sources', type: 'multiselect', label: 'Primary News Sources', options: ['TV News', 'Online News Sites', 'Social Media', 'Newspapers', 'Podcasts', 'Radio'], required: false },
    { id: 'reading_frequency', type: 'select', label: 'Reading Frequency', options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'], required: false },
    { id: 'book_genres', type: 'multiselect', label: 'Favorite Book Genres', options: ['Fiction', 'Non-fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Biography', 'Self-help', 'History', 'Fantasy'], required: false }
  ],
  behavioral_traits: [
    { id: 'personality_type', type: 'select', label: 'Personality Type', options: ['Extrovert', 'Introvert', 'Ambivert'], required: false },
    { id: 'decision_making', type: 'select', label: 'Decision Making Style', options: ['Quick decisions', 'Careful consideration', 'Seeks others\' opinions', 'Depends on situation'], required: false },
    { id: 'learning_style', type: 'select', label: 'Learning Style', options: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'], required: false },
    { id: 'communication_style', type: 'select', label: 'Communication Style', options: ['Direct', 'Diplomatic', 'Analytical', 'Expressive'], required: false },
    { id: 'work_style', type: 'select', label: 'Work Style', options: ['Team player', 'Independent worker', 'Leader', 'Follower', 'Varies by situation'], required: false },
    { id: 'stress_response', type: 'select', label: 'Stress Response', options: ['Problem solver', 'Seeks support', 'Avoids situation', 'Gets overwhelmed'], required: false },
    { id: 'change_adaptation', type: 'scale', label: 'How well do you adapt to change?', min: 1, max: 5, required: false },
    { id: 'feedback_preference', type: 'select', label: 'Feedback Preference', options: ['Direct feedback', 'Gentle feedback', 'Written feedback', 'Verbal feedback'], required: false },
    { id: 'motivation_factors', type: 'multiselect', label: 'What motivates you?', options: ['Money', 'Recognition', 'Achievement', 'Learning', 'Helping others', 'Independence', 'Security', 'Creativity'], required: false }
  ],
  consumer_behavior: [
    { id: 'brand_awareness', type: 'scale', label: 'How important is brand reputation?', min: 1, max: 5, required: false },
    { id: 'price_sensitivity', type: 'scale', label: 'How price-sensitive are you?', min: 1, max: 5, required: false },
    { id: 'review_influence', type: 'scale', label: 'How much do reviews influence your purchases?', min: 1, max: 5, required: false },
    { id: 'impulse_buying', type: 'scale', label: 'How often do you make impulse purchases?', min: 1, max: 5, required: false },
    { id: 'loyalty_programs', type: 'select', label: 'Do you participate in loyalty programs?', options: ['Yes, actively', 'Yes, occasionally', 'Rarely', 'Never'], required: false },
    { id: 'advertising_response', type: 'select', label: 'How do you respond to advertising?', options: ['Very receptive', 'Somewhat receptive', 'Neutral', 'Somewhat resistant', 'Very resistant'], required: false },
    { id: 'product_research', type: 'select', label: 'How much research do you do before major purchases?', options: ['Extensive research', 'Some research', 'Minimal research', 'No research'], required: false },
    { id: 'early_adoption', type: 'scale', label: 'How likely are you to try new products?', min: 1, max: 5, required: false }
  ]
}

export const questionTypes = {
  text: 'Text Input',
  number: 'Number Input',
  date: 'Date Picker',
  select: 'Single Choice',
  multiselect: 'Multiple Choice',
  scale: 'Rating Scale',
  textarea: 'Long Text'
}