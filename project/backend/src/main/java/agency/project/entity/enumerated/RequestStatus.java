package agency.project.entity.enumerated;

public enum RequestStatus {
    PENDING,        // Ожидает рассмотрения
    IN_PROGRESS,    // В обработке
    APPROVED,       // Одобрен
    REJECTED,       // Отклонен
    COMPLETED       // Завершен
}