class ProgressTracker:
    def __init__(self):
        self.total_steps = 14 #todo

        self.completed_steps = set()

    def add_step(self, step: str):
        self.completed_steps.add(step)

    def n_completed(self):
        return len(self.completed_steps)

    def as_dict(self):
        return {
            "total_steps": self.total_steps,
            "n_completed_steps": self.n_completed()
        }
