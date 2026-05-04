package com.finance.dashboard.repository;

import com.finance.dashboard.model.Payment;
import com.finance.dashboard.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /** All payments for a user, most recent first */
    List<Payment> findByUserEmailOrderByDateDesc(String email);

    /** Payments filtered by status */
    List<Payment> findByUserEmailAndStatusOrderByDateDesc(String email, PaymentStatus status);

    /** Upcoming scheduled payments */
    @Query("SELECT p FROM Payment p WHERE p.user.email = :email AND p.status = 'SCHEDULED' ORDER BY p.scheduledDate ASC")
    List<Payment> findScheduledByUser(@Param("email") String email);

    /** Sum of completed payments for a user */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.user.email = :email AND p.status = 'COMPLETED'")
    Double getTotalPaidByUser(@Param("email") String email);

    /** Count of pending payments */
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.user.email = :email AND p.status = 'PENDING'")
    Long countPendingByUser(@Param("email") String email);
}
